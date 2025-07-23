import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicLayout } from "../../shared/layouts";
import { ModalDialog, ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from "@mui/material";
import * as yup from "yup";
import { CustomerService, ICustomerDetail } from "../../shared/services/api/customer/CustomerService";
import { grey } from "@mui/material/colors";
import { CustomerCarsService, ICustomerCarsDetail, ICustomerCarsDTO } from "../../shared/services/api/customer-cars/CustomerCarsService";
import { FormHandles } from '@unform/core';
import { useHasPermission } from "../../shared/hooks";
import EditNoteIcon from '@mui/icons-material/EditNote';

const formValidationSchema: yup.Schema = yup.object().shape({
    name: yup.string().required().min(5).max(60),
    email: yup.string().email().required(),
    addressLine1: yup.string().required().max(100),
    addressLine2: yup.string().max(100),
    city: yup.string().required().max(50),
    county: yup.string().max(50),
    postalCode: yup.string().required().max(20),
    country: yup.string().required().max(50),
    dateOfBirth: yup.date().required(),
    phone: yup.string().required().max(20)
});

const formCustomerCar: yup.Schema = yup.object().shape({
    make: yup.string().required().max(50),
    model: yup.string().required().max(50),
    year: yup.number().required().min(1886).max(new Date().getFullYear()),
    color: yup.string().required().max(30),
    registrationNumber: yup.string().required().max(20),
    vin: yup.string().required().max(20)
});

export const CustomerDetail: React.FC = () => {

    const canWriteCustomerCars = useHasPermission('CUSTOMER_CARS_WRITE');
    const canDeleteCustomerCars = useHasPermission('CUSTOMER_CARS_DELETE');

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [customer, setCustomer] = useState<ICustomerDetail | null>(null);
    const [rows, setRows] = useState<ICustomerCarsDetail[]>([]);
    const [customerCar, setCustomerCar] = useState<ICustomerCarsDetail | null>(null);
    const customerCarFormRef = useRef<FormHandles>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            CustomerService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying customer data', '');
                    navigate('/customers');
                } else {
                    setCustomer(result);
                    setRows(result.cars || []);
                    formRef.current?.setData(result);
                }
            });
        } else {
            setCustomer(null);
            formRef.current?.setData({
                name: '',
                email: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                county: '',
                postalCode: '',
                country: '',
                dateOfBirth: new Date(),
                phone: ''
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
        handleClose();
        if (isSaveAndClose() || titleModal.includes('deleted')) {
            navigate('/customers');
        } else {
            navigate(`/customers/detail/${customer?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: ICustomerDetail) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    CustomerService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding customer', result.message);
                        } else {
                            setCustomer(result);
                            handleOpenModal('success', 'Customer added successfully', '');
                        }
                    });
                } else {
                    CustomerService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing customer', result.message);
                        } else {
                            setCustomer(result);
                            handleOpenModal('success', 'Customer updated successfully', '');
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

    const handleDeleteConfirmation = () => {
        setTypeModal('confirmation');
        setTitleModal('Delete Customer');
        setMessageModal('Are you sure you want to delete this customer? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            CustomerService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting customer', result.message);
                    } else {
                        handleOpenModal('success', 'Customer deleted successfully', '');
                    }
                });
        }
    };

    const handleDeleteCustomerCars = (customerCarsUuid: string) => {
        CustomerCarsService.deleteByUuid(customerCarsUuid)
            .then((result) => {
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error deleting customer car', result.message);
                } else {
                    setRows(rows.filter(row => row.uuid !== customerCarsUuid));
                    handleOpenModal('success', 'Customer car deleted successfully', '');
                }
            });
    };

    const addCustomerCars = (data: ICustomerCarsDTO) => {
        if (!customer) {
            handleOpenModal('error', 'Customer not found', 'Cannot add customer car because customer is not loaded.');
            return;
        }
        formCustomerCar.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (!customerCar) {
                    CustomerCarsService.create({ ...validatedData, customerUuid: customer.uuid }).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding customer car', result.message);
                        } else {
                            setRows([...rows, result]);
                            handleOpenModal('success', 'Customer car added successfully', '');
                        }
                    });
                } else {
                    CustomerCarsService.update(customerCar.uuid, { ...validatedData, customerUuid: customer.uuid }).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error updating customer car', result.message);
                        } else {
                            setRows(rows.map(row => row.uuid === result.uuid ? result : row));
                            handleOpenModal('success', 'Customer car updated successfully', '');
                        }
                    });
                }
            }).catch((errors: yup.ValidationError) => {
                const validationErrors: { [key: string]: string } = {};
                errors.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                    customerCarFormRef.current?.setErrors(validationErrors);
                })
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpen = (uuid: string | undefined) => {
        if (uuid === undefined) {
            customerCarFormRef.current?.setData({
                make: '',
                model: '',
                year: new Date().getFullYear(),
                color: '',
                registrationNumber: '',
                vin: ''
            });
            setCustomerCar(null);
        } else {
            CustomerCarsService.getByUuid(uuid).then((result) => {
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error fetching customer car', result.message);
                } else {
                    setCustomerCar(result);
                    customerCarFormRef.current?.setData(result);
                }
            });
        }
        setOpen(true);
    };


    return (
        <BasicLayout title={uuid === 'create' ? "New Customer" : "Customer detail"} icon="peoples"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/customers/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/customers')}
                />
            }>
            <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                <Box margin={1} component={Paper} >
                    <Form ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Grid container direction={'column'} padding={2} spacing={2} >
                            {isLoading && (
                                <Grid>
                                    <LinearProgress />
                                </Grid>
                            )}
                            <Grid container>
                                <Grid size={6}>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="Email" name="email" placeholder="Email" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="Address line 1" name="addressLine1" placeholder="Address line 1" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="Address line 2" name="addressLine2" placeholder="Address line 2" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="City" name="city" placeholder="City" fullWidth size="small" />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="County" name="county" placeholder="County" fullWidth size="small" />
                                </Grid>
                                <Grid size={2}>
                                    <VTextField label="Postal Code" name="postalCode" placeholder="Postal Code" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="Country" name="country" placeholder="Country" fullWidth size="small" />
                                </Grid>
                                <Grid size={3}>
                                    <VTextField label="Date Of Birth" name="dateOfBirth" fullWidth size="small" type={'date'} />
                                </Grid>
                                <Grid size={3}>
                                    <VTextField label="Phone" name="phone" placeholder="Phone" fullWidth size="small" />
                                </Grid>
                                {customer && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {customer.updatedAt ? new Date(customer.updatedAt).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>)}
                            </Grid>
                        </Grid>
                    </Form >
                    <Grid container direction={'column'} padding={2} spacing={2}>
                        <Grid>
                            <Button
                                color="primary"
                                variant="contained"
                                startIcon={<Icon>add</Icon>}
                                size="small"
                                title="Add a customer car"
                                onClick={() => handleClickOpen(undefined)}
                                disabled={uuid === 'create'}
                            >
                                Add customer car
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid width={'100%'} padding={2} spacing={2}>
                        <TableContainer>
                            <Table size="small" aria-label="a dense table" >
                                <TableHead sx={{ backgroundColor: grey[900] }}>
                                    <TableRow>
                                        <TableCell sx={{ color: grey[50] }}>Make</TableCell>
                                        <TableCell sx={{ color: grey[50] }}>Model</TableCell>
                                        <TableCell sx={{ color: grey[50] }}>Year</TableCell>
                                        <TableCell sx={{ color: grey[50] }}>Color</TableCell>
                                        <TableCell sx={{ color: grey[50] }}>Reg. Number</TableCell>
                                        <TableCell sx={{ color: grey[50] }}>VIN</TableCell>
                                        <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map(row => (
                                        <TableRow key={row.uuid}>
                                            <TableCell>{row.make}</TableCell>
                                            <TableCell>{row.model}</TableCell>
                                            <TableCell>{row.year}</TableCell>
                                            <TableCell>{row.color}</TableCell>
                                            <TableCell>{row.registrationNumber}</TableCell>
                                            <TableCell>{row.vin}</TableCell>
                                            <TableCell sx={{ textAlign: "center" }}>
                                                {canWriteCustomerCars && <IconButton size="small" color="info" sx={{ marginRight: 1 }} title="Edit record"
                                                    onClick={() => handleClickOpen(row.uuid)}>
                                                    <EditNoteIcon fontSize="inherit" />
                                                </IconButton>}
                                                {canDeleteCustomerCars && <IconButton
                                                    size="small"
                                                    color="error"
                                                    title="Delete record"
                                                    onClick={() => handleDeleteCustomerCars(row.uuid)}
                                                    disabled={!customer}
                                                >
                                                    <Icon>delete</Icon>
                                                </IconButton>}
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
                </Box >
            </Box>
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
                <DialogTitle>Customer cars</DialogTitle>
                <DialogContent>
                    <Form ref={customerCarFormRef} onSubmit={addCustomerCars} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        <Grid container padding={1} spacing={2}>
                            <Grid size={6}>
                                <VTextField label="Make" name="make" placeholder="Make" fullWidth size="small" />
                            </Grid>
                            <Grid size={6}>
                                <VTextField label="Model" name="model" placeholder="Model" fullWidth size="small" />
                            </Grid>
                            <Grid size={6}>
                                <VTextField label="Year" name="year" placeholder="Year" fullWidth size="small" />
                            </Grid>
                            <Grid size={6}>
                                <VTextField label="Color" name="color" placeholder="Color" fullWidth size="small" />
                            </Grid>
                            <Grid size={6}>
                                <VTextField label="Reg. Number" name="registrationNumber" placeholder="Reg. Number" fullWidth size="small" />
                            </Grid>
                            <Grid size={6}>
                                <VTextField label="Vin" name="vin" placeholder="Vin" fullWidth size="small" />
                            </Grid>
                            {customerCar && (<Grid size={12} >
                                <Typography variant="caption">
                                    <strong>Created at</strong> {customerCar.createdAt ? new Date(customerCar.createdAt).toLocaleDateString() : 'N/A'} <br />
                                    <strong>Updated at</strong> {customerCar.updatedAt ? new Date(customerCar.updatedAt).toLocaleDateString() : 'N/A'}
                                </Typography>
                            </Grid>)}
                            <Grid size={12}>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button onClick={handleClose} variant="contained" color="secondary">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={() => customerCarFormRef.current?.submitForm()}
                                        variant="contained"
                                        color="primary"
                                    >
                                        {customerCar ? 'Update' : 'Add'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                </DialogContent>
            </Dialog>
        </BasicLayout >
    )
}
