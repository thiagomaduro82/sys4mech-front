import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AutoCompleteCarPart, AutoCompleteCustomer, AutoCompleteCustomerCar, AutoCompleteEmployee, AutoCompleteService, AutoCompleteStatus, ModalDialog } from "../../shared/components";
import { Form } from "@unform/web";
import { VFormattedAmountField, VTextField } from "../../shared/forms";
import { Box, Button, Grid, Icon, IconButton, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material";
import * as yup from "yup";
import { IServiceOrderDetail, IServiceOrderDetailDTO, ServiceOrderService } from "../../shared/services/api/service-order/ServiceOrderService";
import { useDrawerContext } from "../../shared/contexts";
import { grey } from "@mui/material/colors";
import DeleteIcon from '@mui/icons-material/Delete';
import { ICustomerCarsDetail } from "../../shared/services/api/customer-cars/CustomerCarsService";
import { FormHandles } from "@unform/core";
import { IServiceOrderServicesDetail, IServiceOrderServicesDetailDTO, ServiceOrderServicesService } from "../../shared/services/api/service-order/ServiceOrderServicesService";
import { IServiceOrderPartsDetail, IServiceOrderPartsDetailDTO, ServiceOrderPartsService } from "../../shared/services/api/service-order/ServiceOrderPartsService";
import { environment } from "../../shared/environment";

const formOrderSchema: yup.Schema = yup.object().shape({
    customerUuid: yup.string().required(),
    customerCarUuid: yup.string().required(),
    employeeUuid: yup.string().required(),
    status: yup.string().required(),
    workRequired: yup.string().required(),
    observations: yup.string().required()
});

interface IFormServiceDTO {
    serviceOrderUuid: string,
    ServiceUuid: string,
    service_quantity: number,
    service_amount: number
}

interface IFormPartsDTO {
    orderUuid: string,
    carPartUuid: string,
    quantity: number,
    amount: number
}

const formServiceSchema: yup.Schema = yup.object().shape({
    serviceOrderUuid: yup.string(),
    serviceUuid: yup.string().required(),
    service_quantity: yup.number().required(),
    service_amount: yup.number().required()
});

const formCarPartSchema: yup.Schema = yup.object().shape({
    orderUuid: yup.string(),
    carPartUuid: yup.string().required(),
    quantity: yup.number().required(),
    amount: yup.number().required()
});

export const ServiceOrderDetail: React.FC = () => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { toggleDrawer } = useDrawerContext();

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const serviceOrderFormRef = useRef<FormHandles>(null);
    const serviceFormRef = useRef<FormHandles>(null);
    const carPartFormRef = useRef<FormHandles>(null);

    const [selectedCustomerUuid, setSelectedCustomerUuid] = useState<string | undefined>();
    const [customerCars, setCustomerCars] = useState<ICustomerCarsDetail[]>([]);


    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [serviceOrder, setServiceOrder] = useState<IServiceOrderDetail | null>(null);
    const [serviceOrderServices, setServiceOrderServices] = useState<IServiceOrderServicesDetail[]>([]);
    const [serviceOrderParts, setServiceOrderParts] = useState<IServiceOrderPartsDetail[]>([]);
    const [selectedId, setSelectedId] = useState<number>(0);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            ServiceOrderService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying service order data', '');
                    navigate('/service-orders');
                } else {
                    setServiceOrder(result);
                    setServiceOrderServices(result.serviceOrderServices);
                    setServiceOrderParts(result.serviceOrderParts);

                    setSelectedCustomerUuid(result.customer.uuid);
                    setCustomerCars(result.customer.cars ?? []);

                    serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                    carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);

                    serviceOrderFormRef.current?.setData({
                        customerUuid: result.customer.uuid,
                        customerCarUuid: result.customerCar.uuid,
                        employeeUuid: result.employee.uuid,
                        status: result.status,
                        workRequired: result.workRequired,
                        observations: result.observations
                    });
                }
            });
        } else {
            setServiceOrder(null);
            serviceOrderFormRef.current?.setData({
                customerUuid: '',
                customerCarUuid: '',
                employeeUuid: '',
                status: '',
                workRequired: '',
                observations: ''
            });
        }
    }, [uuid, navigate, serviceOrderFormRef]);

    const handleSaveOrder = (data: IServiceOrderDetailDTO) => {
        formOrderSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    ServiceOrderService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding service order', result.message);
                        } else {
                            setServiceOrder(result);
                            serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                            carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);
                            handleOpenModal('success', 'Service order added successfully', '');
                        }
                    });
                } else {
                    console.log(validatedData);
                    ServiceOrderService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing service order', result.message);
                        } else {
                            setServiceOrder(result);
                            serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                            carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);
                            handleOpenModal('success', 'Service order updated successfully', '');
                        }
                    });
                }
            }).catch((errors: yup.ValidationError) => {
                const validationErrors: { [key: string]: string } = {};
                errors.inner.forEach(error => {
                    if (!error.path) return;
                    validationErrors[error.path] = error.message;
                    serviceOrderFormRef.current?.setErrors(validationErrors);
                })
            });
    }

    const handleSaveService = (data: IFormServiceDTO) => {
        if (serviceOrder) {
            formServiceSchema.validate(data, { abortEarly: false })
                .then((validatedData) => {
                    setIsLoading(true);
                    const serviceData: IServiceOrderServicesDetailDTO = {
                        serviceOrderUuid: serviceOrder.uuid,
                        serviceUuid: validatedData.serviceUuid,
                        quantity: validatedData.service_quantity,
                        amount: validatedData.service_amount
                    };
                    ServiceOrderServicesService.create(serviceData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding services', result.message);
                        } else {
                            setIsLoading(true);
                            ServiceOrderService.getByUuid(uuid).then(result => {
                                setIsLoading(false);
                                if (result instanceof Error) {
                                    handleOpenModal('error', 'Error getting service order by UUID', result.message);
                                } else {
                                    setServiceOrder(result);
                                    setServiceOrderServices(result.serviceOrderServices);
                                    setServiceOrderParts(result.serviceOrderParts);

                                    setSelectedCustomerUuid(result.customer.uuid);
                                    setCustomerCars(result.customer.cars ?? []);

                                    serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                                    carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);

                                    serviceOrderFormRef.current?.setData({
                                        customerUuid: result.customer.uuid,
                                        customerCarUuid: result.customerCar.uuid,
                                        employeeUuid: result.employee.uuid,
                                        status: result.status,
                                        workRequired: result.workRequired,
                                        observations: result.observations
                                    });
                                }
                            })
                            handleOpenModal('success', 'Services added successfully', '');
                        }
                    });
                }).catch((errors: yup.ValidationError) => {
                    const validationErrors: { [key: string]: string } = {};
                    errors.inner.forEach(error => {
                        if (!error.path) return;
                        validationErrors[error.path] = error.message;
                        serviceOrderFormRef.current?.setErrors(validationErrors);
                    })
                });
        }
    };

    const handleSaveCarPart = (data: IFormPartsDTO) => {
        if (serviceOrder) {
            formCarPartSchema.validate(data, { abortEarly: false })
                .then((validatedData) => {
                    setIsLoading(true);
                    const partsData: IServiceOrderPartsDetailDTO = {
                        serviceOrderUuid: serviceOrder.uuid,
                        carPartUuid: validatedData.carPartUuid,
                        quantity: validatedData.quantity,
                        amount: validatedData.amount
                    };
                    ServiceOrderPartsService.create(partsData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding car parts', result.message);
                        } else {
                            ServiceOrderService.getByUuid(uuid).then(result => {
                                if (result instanceof Error) {
                                    handleOpenModal('error', 'Error getting service order by UUID', result.message);
                                } else {
                                    setServiceOrder(result);
                                    setServiceOrderServices(result.serviceOrderServices);
                                    setServiceOrderParts(result.serviceOrderParts);

                                    setSelectedCustomerUuid(result.customer.uuid);
                                    setCustomerCars(result.customer.cars ?? []);

                                    serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                                    carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);

                                    serviceOrderFormRef.current?.setData({
                                        customerUuid: result.customer.uuid,
                                        customerCarUuid: result.customerCar.uuid,
                                        employeeUuid: result.employee.uuid,
                                        status: result.status,
                                        workRequired: result.workRequired,
                                        observations: result.observations
                                    });
                                }
                            })
                            handleOpenModal('success', 'Car parts added successfully', '');
                        }
                    });
                }).catch((errors: yup.ValidationError) => {
                    console.log(errors);
                    const validationErrors: { [key: string]: string } = {};
                    errors.inner.forEach(error => {
                        if (!error.path) return;
                        validationErrors[error.path] = error.message;
                        serviceOrderFormRef.current?.setErrors(validationErrors);
                    })
                });
        }
    };

    const handleOpenModal = (type: 'info' | 'warning' | 'error' | 'success' | 'confirmation',
        title: string, message: string, id?: number) => {
        setTypeModal(type);
        setTitleModal(title);
        setMessageModal(message);
        if (id) {
            setSelectedId(id);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setMessageModal('');
        setTitleModal('');
        setOpenModal(false);
        navigate(`/service-orders/detail/${serviceOrder?.uuid || 'create'}`);
    };

    const handleDelete = (id: number) => {
        if (titleModal.includes('Car-Parts')) {
            ServiceOrderPartsService.deleteById(id).then((result) => {
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error deleting Car-Parts', result.message);
                } else {
                    setIsLoading(true);
                    ServiceOrderService.getByUuid(uuid).then(result => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error getting service order by UUID', result.message);
                        } else {
                            setServiceOrder(result);
                            setServiceOrderServices(result.serviceOrderServices);
                            setServiceOrderParts(result.serviceOrderParts);

                            setSelectedCustomerUuid(result.customer.uuid);
                            setCustomerCars(result.customer.cars ?? []);

                            serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                            carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);

                            serviceOrderFormRef.current?.setData({
                                customerUuid: result.customer.uuid,
                                customerCarUuid: result.customerCar.uuid,
                                employeeUuid: result.employee.uuid,
                                status: result.status,
                                workRequired: result.workRequired,
                                observations: result.observations
                            });
                        }
                    })
                    handleOpenModal('success', 'Car-Parts deleted successfully', '');
                }
            });
        } else if (titleModal.includes('Service')) {
            ServiceOrderServicesService.deleteById(id).then((result) => {
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error deleting Service', result.message);
                } else {
                    setIsLoading(true);
                    ServiceOrderService.getByUuid(uuid).then(result => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error getting service order by UUID', result.message);
                        } else {
                            setServiceOrder(result);
                            setServiceOrderServices(result.serviceOrderServices);
                            setServiceOrderParts(result.serviceOrderParts);

                            setSelectedCustomerUuid(result.customer.uuid);
                            setCustomerCars(result.customer.cars ?? []);

                            serviceFormRef.current?.setFieldValue('serviceOrderUuid', result.uuid);
                            carPartFormRef.current?.setFieldValue('orderUuid', result.uuid);

                            serviceOrderFormRef.current?.setData({
                                customerUuid: result.customer.uuid,
                                customerCarUuid: result.customerCar.uuid,
                                employeeUuid: result.employee.uuid,
                                status: result.status,
                                workRequired: result.workRequired,
                                observations: result.observations
                            });
                        }
                    })
                    handleOpenModal('success', 'Service deleted successfully', '');
                }
            });
        }
    };

    return (
        <Box height={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            <Box padding={1} display={'flex'} height={theme.spacing(smDown ? 4 : mdDown ? 6 : 8)} alignItems={'center'} gap={2} >
                {smDown && (
                    <IconButton onClick={toggleDrawer}>
                        <Icon>menu</Icon>
                    </IconButton>
                )}
                <Icon fontSize={smDown ? 'small' : mdDown ? 'medium' : 'large'} sx={{ color: "gray" }}>
                    car_repair
                </Icon>
                <Typography
                    variant={smDown ? 'h6' : mdDown ? 'h5' : 'h4'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    sx={{ color: "gray" }}
                >
                    Service Order
                </Typography>
            </Box>
            <Box flex={1} overflow={'auto'}>
                <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                    <Box margin={1} component={Paper} sx={{ width: '100%' }}>
                        <Form ref={serviceOrderFormRef} onSubmit={handleSaveOrder} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <Grid container direction={'column'} spacing={2} >
                                {isLoading && (
                                    <Grid>
                                        <LinearProgress />
                                    </Grid>
                                )}

                                <Grid container spacing={2} padding={3}>
                                    <Grid size={12}>
                                        <Typography variant={'h6'}>
                                            Order
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid size={4}>
                                        <AutoCompleteCustomer
                                            isExternalLoading={isLoading}
                                            onChange={(customer) => {
                                                const customerUuid = customer?.uuid ?? undefined;
                                                setSelectedCustomerUuid(customerUuid);
                                                serviceOrderFormRef.current?.setFieldValue('customerUuid', customerUuid);
                                                setCustomerCars(customer?.customerCars ?? []);
                                                serviceOrderFormRef.current?.setFieldValue('customerCarUuid', undefined);
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <AutoCompleteCustomerCar isExternalLoading={isLoading} customerCars={customerCars} />
                                    </Grid>
                                    <Grid size={4}>
                                        <AutoCompleteEmployee isExternalLoading={isLoading} />
                                    </Grid>
                                    <Grid size={2}>
                                        <AutoCompleteStatus isExternalLoading={isLoading} />
                                    </Grid>
                                    <Grid size={6}>
                                        <VTextField label="Work required" name="workRequired" placeholder="Work required" fullWidth size="small" />
                                    </Grid>
                                    <Grid size={6}>
                                        <VTextField label="Observations" name="observations" placeholder="Observations" fullWidth size="small" />
                                    </Grid>
                                    <Grid size={2}>
                                        <Button variant={'contained'} color={'primary'} disableElevation startIcon={<Icon>save</Icon>} type={'submit'}>
                                            <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                                                {uuid === 'create' ? 'Add service order' : 'Update service order'}
                                            </Typography>
                                        </Button>
                                    </Grid>
                                    {serviceOrder && (<Grid size={10} >
                                        <Typography variant="caption">
                                            <strong>Created at</strong> {serviceOrder.createdAt ? new Date(serviceOrder.createdAt).toLocaleDateString() : 'N/A'} <br />
                                            <strong>Updated at</strong> {serviceOrder.updatedAt ? new Date(serviceOrder.updatedAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </Grid>)}
                                </Grid>
                            </Grid>
                        </Form >
                        <Form ref={serviceFormRef} onSubmit={handleSaveService} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <Grid container direction={'column'} spacing={2} >
                                <Grid container spacing={2} paddingX={3} paddingBottom={2}>
                                    <Grid size={12}>
                                        <Typography variant={'h6'}>
                                            Service
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid size={4}>
                                        <AutoCompleteService
                                            isExternalLoading={isLoading}
                                            onChange={(service) => {
                                                serviceFormRef.current?.setFieldValue('serviceUuid', service?.uuid ?? '');
                                                serviceFormRef.current?.setFieldValue('service_amount', service?.amount ?? 0);
                                                serviceFormRef.current?.setFieldValue('service_quantity', 1);
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <VFormattedAmountField
                                            label="Quantity"
                                            name="service_quantity"
                                            placeholder="Quantity"
                                            fullWidth
                                            size="small"
                                            type="number"
                                            inputProps={{ step: "0.01", min: "1" }}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <VFormattedAmountField
                                            label="Amount (€)"
                                            name="service_amount"
                                            placeholder="Amount  (€)"
                                            fullWidth
                                            size="small"
                                            type="number"
                                            inputProps={{ step: "0.01", min: "0" }}
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <Button variant={'contained'} color={'primary'} disableElevation startIcon={<Icon>save</Icon>} disabled={!serviceOrder} type={'submit'} >
                                            <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                                                Add services
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                        <Grid container direction={'column'} spacing={2} >
                            <Grid container spacing={2} paddingX={3} paddingBottom={2}>
                                <Grid size={12}>
                                    <TableContainer>
                                        <Table size="small" aria-label="a dense table">
                                            <TableHead sx={{ backgroundColor: grey[900] }}>
                                                <TableRow>
                                                    <TableCell sx={{ color: grey[50] }}>Service</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Quantity</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Amount (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Tax (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Total + Tax (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {serviceOrderServices.map(row => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.service.name}</TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {row.quantity.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {row.amount.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {((row.amount * row.quantity) * (row.service.vatRate / 100)).toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {(((row.amount * row.quantity) * (row.service.vatRate / 100)) + (row.amount * row.quantity)).toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton size="small" color="error" title="Delete record"
                                                                onClick={() => handleOpenModal("confirmation", "Delete Service", "Are you sure you want to delete this Service? This operation cannot be undone!", row.id)}>
                                                                <DeleteIcon fontSize="inherit" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                            {serviceOrderServices.length === 0 && !isLoading && (
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
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Form ref={carPartFormRef} onSubmit={handleSaveCarPart} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            <Grid container direction={'column'} spacing={2} >
                                <Grid container spacing={2} paddingX={3} paddingBottom={2}>
                                    <Grid size={12}>
                                        <Typography variant={'h6'}>
                                            Car Parts
                                        </Typography>
                                        <hr />
                                    </Grid>
                                    <Grid size={4}>
                                        {serviceOrder?.uuid && (
                                            <VTextField
                                                name="orderUuid"
                                                type="hidden"
                                                value={serviceOrder.uuid}
                                                style={{ display: 'none' }}
                                            />
                                        )}

                                        <AutoCompleteCarPart
                                            isExternalLoading={isLoading}
                                            onChange={(carPart) => {
                                                carPartFormRef.current?.setFieldValue('carPartUuid', carPart?.uuid ?? '');
                                                carPartFormRef.current?.setFieldValue('amount', carPart?.amount ?? 0);
                                                carPartFormRef.current?.setFieldValue('quantity', 1);
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <VFormattedAmountField
                                            label="Quantity"
                                            name="quantity"
                                            placeholder="Quantity"
                                            fullWidth
                                            size="small"
                                            type="number"
                                            inputProps={{ step: "0.01", min: "1" }}
                                        />
                                    </Grid>
                                    <Grid size={3}>
                                        <VFormattedAmountField
                                            label="Amount (€)"
                                            name="amount"
                                            placeholder="Amount  (€)"
                                            fullWidth
                                            size="small"
                                            type="number"
                                            inputProps={{ step: "0.01", min: "0" }}
                                        />
                                    </Grid>
                                    <Grid size={2}>
                                        <Button variant={'contained'} color={'primary'} disableElevation startIcon={<Icon>save</Icon>} disabled={!serviceOrder} type={'submit'}>
                                            <Typography variant={'button'} textOverflow={'ellipsis'} whiteSpace={'nowrap'} overflow={'hidden'}>
                                                Add Car parts
                                            </Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Form>
                        <Grid container direction={'column'} spacing={2} >
                            <Grid container spacing={2} paddingX={3} paddingBottom={2}>
                                <Grid size={12}>
                                    <TableContainer>
                                        <Table size="small" aria-label="a dense table">
                                            <TableHead sx={{ backgroundColor: grey[900] }}>
                                                <TableRow>
                                                    <TableCell sx={{ color: grey[50] }}>Car part</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Quantity</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Amount (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Tax (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], textAlign: "end" }}>Total + Tax (€)</TableCell>
                                                    <TableCell sx={{ color: grey[50], width: "100px", textAlign: "center" }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                {serviceOrderParts.map(row => (
                                                    <TableRow key={row.id}>
                                                        <TableCell>{row.carPart.name}</TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {row.quantity.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {row.amount.toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {((row.amount * row.quantity) * (row.carPart.vatRate / 100)).toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "end" }}>
                                                            {(((row.amount * row.quantity) * (row.carPart.vatRate / 100)) + (row.amount * row.quantity)).toLocaleString('en-IE', { style: 'currency', currency: 'EUR' })}
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>
                                                            <IconButton size="small" color="error" title="Delete record"
                                                                onClick={() => handleOpenModal("confirmation", "Delete Car-Parts", "Are you sure you want to delete this Car-Parts? This operation cannot be undone!", row.id)}>
                                                                <DeleteIcon fontSize="inherit" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                                }
                                            </TableBody>
                                            {serviceOrderParts.length === 0 && !isLoading && (
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
                                            </TableFooter>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
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
                    onConfirm={() => handleDelete(selectedId)}
                />
            </Box>
        </Box>


    )
}
