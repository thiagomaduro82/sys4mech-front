import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IUserDetail, UserService } from "../../shared/services/api/user/UserService";
import { ISearchParams, ModalDialog, ToolbarList } from "../../shared/components";
import { BasicLayout } from "../../shared/layouts";
import { environment } from "../../shared/environment";
import { Box, Button, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { grey } from "@mui/material/colors";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';


export const UserList: React.FC = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState<IUserDetail[]>([]);
    const [searchParams, setSearchParams] = useState<ISearchParams>();
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);
        let pageSize = searchParams?.pageSize || 5;
        let order = searchParams?.order.toLowerCase() || 'asc';
        UserService.getAll(searchParams?.field, searchParams?.searchFor, (page - 1), pageSize, order)
            .then((response) => {
                setIsLoading(false);
                if (response instanceof Error) {
                    console.log(response);
                    handleOpenModal('error', 'Error fetching users', response.message, null);
                } else {
                    setRows(response.content);
                    setTotalCount(response.totalElements);
                    setTotalPages(response.totalPages);
                }
            });
    }, [searchParams, page]);

    const handleOpenModal = (type: 'info' | 'warning' | 'error' | 'success' | 'confirmation',
        title: string, message: string, uuid: string | null) => {
        setTypeModal(type);
        setTitleModal(title);
        setMessageModal(message);
        setSelectedUuid(uuid);
        setOpenModal(true);
    };

    const handleDelete = () => {
        if (selectedUuid) {
            UserService.deleteByUuid(selectedUuid)
                .then((response) => {
                    if (response instanceof Error) {
                        handleOpenModal('error', 'Error deleting user', response.message, null);
                    } else {
                        handleOpenModal('success', 'User deleted successfully', '', null);
                        setRows(prevRows => prevRows.filter(row => row.uuid !== selectedUuid));
                        setTotalCount(prevCount => prevCount - 1);
                    }
                    handleCloseModal();
                });
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedUuid(null);
    };

    return (
        <BasicLayout
            title={'Users'}
            icon="person"
            toolbar={<ToolbarList
                pageSizeList={environment.pageSizeOptions}
                fieldsList={['Name', 'Email']}
                orderList={['Asc', 'Desc']}
                onClickSearchButton={params => { setSearchParams(params); setPage(1); }}
            />}>
            <Box component={Paper} sx={{ p: 1, m: 1, width: 'auto' }}>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<Icon>add</Icon>}
                    size="small"
                    sx={{ marginBottom: 2 }}
                    title="Add a new record"
                    onClick={() => navigate('/users/detail/create')}
                >
                    New
                </Button>
                <TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <TableHead sx={{ backgroundColor: grey[900] }}>
                            <TableRow>
                                <TableCell sx={{ color: grey[50] }}>Name</TableCell>
                                <TableCell sx={{ color: grey[50] }}>Email</TableCell>
                                <TableCell sx={{ color: grey[50] }}>Role</TableCell>
                                <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.uuid}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.role.name}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <IconButton size="small" color="info" sx={{ marginRight: 1 }} title="Edit record"
                                            onClick={() => navigate(`/users/detail/${row.uuid}`)}>
                                            <EditNoteIcon fontSize="inherit" />
                                        </IconButton>

                                        <IconButton size="small" color="error" title="Delete record"
                                            onClick={() => handleOpenModal("confirmation", "Delete user", "Are you sure you want to delete this user? This operation cannot be undone!", row.uuid)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {totalCount === 0 && !isLoading && (
                            <caption>{environment.emptyListMessage}</caption>
                        )}
                        <TableFooter>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <LinearProgress variant="indeterminate" />
                                    </TableCell>
                                </TableRow>
                            )}
                            {(totalCount > 0 && totalPages > 1) && (
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Pagination
                                            page={page}
                                            count={totalPages}
                                            onChange={(_, newPage) => setPage(newPage)}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
            <ModalDialog
                open={openModal}
                type={typeModal}
                title={titleModal}
                message={messageModal}
                onClose={handleCloseModal}
                onCancel={handleCloseModal}
                onConfirm={handleDelete}
            />
        </BasicLayout>
    );
}