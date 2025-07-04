import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useVForm, VTextField } from "../../shared/forms";
import { useEffect, useState } from "react";
import { IRoleDetail, RoleService } from "../../shared/services/api/role/RoleService";
import { BasicLayout } from "../../shared/layouts";
import { ModalDialog, ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Icon, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import { IPermissionDetail, PermissionService } from "../../shared/services/api/permission/PermissionService";
import { IRolePermissions, RolePermissionsService } from "../../shared/services/api/role-premissions/RolePermissionsService";
import { grey } from "@mui/material/colors";

interface IFormData {
    name: string;
}

const formValidationSchema = yup.object().shape({
    name: yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters long')
        .max(50, 'Name must not exceed 50 characters')
});

export const RoleDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState<IPermissionDetail[]>([]);
    const [permissionsRows, setPermissionsRows] = useState<IPermissionDetail[]>([]);
    const [role, setRole] = useState<IRoleDetail | null>(null);
    const [permissionId, setPermissionId] = useState<number | null>(null);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (uuid && uuid !== 'create') {
            setIsLoading(true);
            RoleService.getByUuid(uuid).then((response) => {
                setIsLoading(false);
                if (response instanceof Error) {
                    handleOpenModal('error', 'Error displaying permission data', '');
                    navigate('/roles');
                } else {
                    setRole(response);
                    setRows(response.permissions || []);
                    formRef.current?.setData(response);
                }
            });
        } else {
            setRole(null);
            setRows([]);
            formRef.current?.setData({
                name: ''
            });
        }
    }, [uuid, navigate, formRef]);

    const handleOpenModal = (type: 'info' | 'warning' | 'error' | 'success' | 'confirmation',
        title: string, message: string) => {
        setTypeModal(type);
        setTitleModal(title);
        setMessageModal(message);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setMessageModal('');
        setTitleModal('');
        setOpenModal(false);
        if (isSaveAndClose() || titleModal.includes('deleted')) {
            navigate('/roles');
        } else {
            navigate(`/roles/detail/${role?.uuid || 'create'}`);
        }
    };

    const handleDeleteConfirmation = () => {
        setTypeModal('confirmation');
        setTitleModal('Delete Role');
        setMessageModal('Are you sure you want to delete this role? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleClickOpen = () => {
        PermissionService.getAllList().then((result) => {
            if (result instanceof Error) {
                handleOpenModal('error', 'Error fetching permissions', result.message);
            } else {
                setPermissionsRows(result);
            }
        });
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addRolePermission = () => {
        if (!role) {
            handleOpenModal('error', 'Role not found', 'Cannot add permission because role is not loaded.');
            return;
        }

        let rolePermissions: IRolePermissions = {
            id: null,
            roleId: role.id,
            permissionId: permissionId
        };

        RolePermissionsService.createRolePermission(rolePermissions).then(result => {
            if (result instanceof Error) {
                handleOpenModal('error', 'Error adding permission for this role', result.message);
            } else {
                if (role?.uuid) {
                    RoleService.getByUuid(role.uuid).then((response) => {
                        if (!(response instanceof Error)) {
                            setRole(response);
                            setRows(response.permissions || []);
                        }
                    });
                }
                setOpen(false);
            }
        })
    };

    const handleSave = (data: IFormData) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    RoleService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding role', result.message);
                        } else {
                            setRole(result);
                            handleOpenModal('success', 'Role added successfully', '');
                        }
                    });
                } else if (uuid) {
                    RoleService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing role', result.message);
                        } else {
                            setRole(result);
                            handleOpenModal('success', 'Role updated successfully', '');
                        }
                    });
                }
            }).catch((errors: yup.ValidationError) => {
                const validationErrors: { [key: string]: string } = {};
                errors.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                    formRef.current?.setErrors(validationErrors);
                })
            });
    }

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            RoleService.deleteByUuid(uuid).then(result => {
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error deleting role', result.message);
                } else {
                    handleOpenModal('success', 'Role deleted successfully', '');
                }
            })
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New Role" : "Role detail"}
            icon="shield"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/roles/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/roles')}
                />
            }>
            <Form ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                    <Box margin={1} component={Paper} sx={{ width: { lg: '70%', xl: '50%' } }} >
                        <Grid container direction={'column'} padding={2} spacing={2}>
                            {isLoading && (
                                <Grid>
                                    <LinearProgress />
                                </Grid>
                            )}
                            <Grid container spacing={2}>
                                <Grid size={16}>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                                {role && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {role.updatedAt ? new Date(role.updatedAt).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>)}
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        startIcon={<Icon>add</Icon>}
                                        size="small"
                                        title="Add a permission"
                                        onClick={handleClickOpen}
                                        disabled={uuid === 'create'}
                                    >
                                        Add permission
                                    </Button>
                                </Grid>
                                <Grid width={'100%'}>
                                    <TableContainer>
                                        <Table size="small" aria-label="a dense table" >
                                            <TableHead sx={{ backgroundColor: grey[900] }}>
                                                <TableRow>
                                                    <TableCell sx={{ color: grey[50] }}>Permissions</TableCell>
                                                    <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map(row => (
                                                    <TableRow key={row.uuid}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton size="small" color="error" title="Delete record" onClick={() => handleDelete(row.uuid)}>
                                                                <Icon>delete</Icon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            {(rows.length === 0) && (
                                                <caption>No records ...</caption>
                                            )}
                                            <TableFooter>
                                                {isLoading && (
                                                    <TableRow>
                                                        <TableCell colSpan={4}>
                                                            <LinearProgress variant="indeterminate" />
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box >
                </Box>
            </Form >
            <ModalDialog
                open={openModal}
                type={typeModal}
                title={titleModal}
                message={messageModal}
                onCancel={() => handleCloseModal()}
                onClose={() => handleCloseModal()}
                onConfirm={() => handleDelete(uuid)}
            />
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle>Permissions</DialogTitle>
                <DialogContent>
                    <DialogContentText marginBottom={3}>
                        Select the Permission
                    </DialogContentText>
                    <FormControl fullWidth>
                        <Grid container spacing={2} marginBottom={2}>
                            <Grid size={16}>
                                <InputLabel id="label-select-permission">Permission</InputLabel>
                                <Select
                                    fullWidth
                                    labelId="label-select-permission"
                                    id="select-permission"
                                    label="Permission"
                                    value={permissionId}
                                    onChange={e => setPermissionId(e.target.value === "" ? null : Number(e.target.value))}
                                >
                                    {permissionsRows && (
                                        permissionsRows.map((item) => (
                                            <MenuItem value={item.id} key={item.uuid}>{item.description}</MenuItem>
                                        ))
                                    )}
                                </Select>
                            </Grid>
                        </Grid>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='contained' color='secondary'>Cancel</Button>
                    <Button onClick={addRolePermission} variant='contained' color='primary'>Add</Button>
                </DialogActions>
            </Dialog>
        </BasicLayout >
    );
};