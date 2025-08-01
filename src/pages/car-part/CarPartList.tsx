import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ISearchParams, ModalDialog, ToolbarList } from "../../shared/components";
import { BasicLayout } from "../../shared/layouts";
import { environment } from "../../shared/environment";
import { Box, Button, Icon, IconButton, LinearProgress, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from "@mui/material";
import { grey } from "@mui/material/colors";
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { CarPartService, ICarPartDetail } from "../../shared/services/api/car-part/CarPartService";


export const CarPartList: React.FC = () => {

    const navigate = useNavigate();
    const [rows, setRows] = useState<ICarPartDetail[]>([]);
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
        CarPartService.getAll(searchParams?.field, searchParams?.searchFor, (page - 1), pageSize, order)
            .then((response) => {
                setIsLoading(false);
                if (response instanceof Error) {
                    console.log(response);
                    handleOpenModal('error', 'Error fetching car-part', response.message, null);
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
            CarPartService.deleteByUuid(selectedUuid)
                .then((response) => {
                    if (response instanceof Error) {
                        handleOpenModal('error', 'Error deleting car-part', response.message, null);
                    } else {
                        handleOpenModal('success', 'Car-part deleted successfully', '', null);
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
            title={'Car Parts'}
            icon="car_crash"
            toolbar={<ToolbarList
                pageSizeList={environment.pageSizeOptions}
                fieldsList={['Name', 'Description']}
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
                    onClick={() => navigate('/car-parts/detail/create')}
                >
                    New
                </Button>
                <TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <TableHead sx={{ backgroundColor: grey[900] }}>
                            <TableRow>
                                <TableCell sx={{ color: grey[50] }}>Name</TableCell>
                                <TableCell sx={{ color: grey[50] }}>Supplier</TableCell>
                                <TableCell sx={{ color: grey[50], textAlign: "end" }}>Sell Price (€)</TableCell>
                                <TableCell sx={{ color: grey[50], textAlign: "end" }}>Vat Rate (%)</TableCell>
                                <TableCell sx={{ color: grey[50], textAlign: "end" }}>Stock</TableCell>
                                <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.uuid}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.supplier.name}</TableCell>
                                    <TableCell sx={{ textAlign: "end" }}>{row.sellingPrice.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}</TableCell>
                                    <TableCell sx={{ textAlign: "end" }}>{row.vatRate.toLocaleString('en-IE', { minimumFractionDigits:2, maximumFractionDigits: 2 })}%</TableCell>
                                    <TableCell sx={{ textAlign: "end" }}>{row.stockQuantity.toLocaleString('en-IE', { minimumFractionDigits:2, maximumFractionDigits: 2 })}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <IconButton size="small" color="info" sx={{ marginRight: 1 }} title="Edit record"
                                            onClick={() => navigate(`/car-parts/detail/${row.uuid}`)}>
                                            <EditNoteIcon fontSize="inherit" />
                                        </IconButton>

                                        <IconButton size="small" color="error" title="Delete record"
                                            onClick={() => handleOpenModal("confirmation", "Delete car-part", "Are you sure you want to delete this car-part? This operation cannot be undone!", row.uuid)}>
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