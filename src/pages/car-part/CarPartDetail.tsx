import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useVForm, VTextField } from "../../shared/forms";
import { useEffect, useState } from "react";
import { BasicLayout } from "../../shared/layouts";
import { AutoCompleteSupplier, ModalDialog, ToolbarDetail } from "../../shared/components";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { Form } from "@unform/web";
import { CarPartService, ICarPartDetail, ICarPartDTO } from "../../shared/services/api/car-part/CarPartService";

const formValidationSchema: yup.Schema = yup.object().shape({
    name: yup.string().required().min(1).max(100),
    description: yup.string().required().min(1).max(255),
    costPrice: yup.number().required().positive(),
    sellingPrice: yup.number().required().positive(),
    vatRate: yup.number().required().positive().max(100),
    barcode: yup.string().required().min(1).max(50),
    stockQuantity: yup.number().required(),
    minStockQuantity: yup.number().required().positive(),
    supplierUuid: yup.string().required(),
});

export const CarPartDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [carPart, setCarPart] = useState<ICarPartDetail | null>(null);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            CarPartService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying car part data', '');
                    navigate('/car-parts');
                } else {
                    setCarPart(result);
                    formRef.current?.setData({
                        name: result.name,
                        description: result.description,
                        costPrice: result.costPrice,
                        sellingPrice: result.sellingPrice,
                        vatRate: result.vatRate,
                        barcode: result.barcode,
                        stockQuantity: result.stockQuantity,
                        minStockQuantity: result.minStockQuantity,
                        supplierUuid: result.supplier.uuid
                    });
                }
            });
        } else {
            setCarPart(null);
            formRef.current?.setData({
                name: '',
                description: '',
                costPrice: 0,
                sellingPrice: 0,
                vatRate: 0,
                barcode: '',
                stockQuantity: 0,
                minStockQuantity: 0,
                supplierUuid: ''
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
            navigate('/car-parts');
        } else {
            navigate(`/car-parts/detail/${carPart?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: ICarPartDTO) => {
        console.log('handleSave', data);
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    CarPartService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding car part', result.message);
                        } else {
                            setCarPart(result);
                            handleOpenModal('success', 'Car part added successfully', '');
                        }
                    });
                } else {
                    CarPartService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing car part', result.message);
                        } else {
                            setCarPart(result);
                            handleOpenModal('success', 'Car part updated successfully', '');
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
        setTitleModal('Delete User');
        setMessageModal('Are you sure you want to delete this car part? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            CarPartService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting car part', result.message);
                    } else {
                        handleOpenModal('success', 'Car part deleted successfully', '');
                    }
                });
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New car part" : "Car part detail"} icon="car_crash"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/car-parts/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/car-parts')}
                />
            }>
            <Form ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                    <Box margin={1} component={Paper} sx={{ width: { lg: '70%', xl: '50%' } }} >
                        <Grid container direction={'column'} padding={2} spacing={2} >
                            {isLoading && (
                                <Grid>
                                    <LinearProgress />
                                </Grid>
                            )}
                            <Grid container spacing={2} padding={3}>
                                <Grid size={12}>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                                <Grid size={12}>
                                    <VTextField label="Description" name="description" placeholder="Description" fullWidth size="small" />
                                </Grid>
                                <Grid size={12}>
                                    <AutoCompleteSupplier isExternalLoading={isLoading} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Cost Price (€)" name="costPrice" placeholder="Cost Price (€)" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Selling Price (€)" name="sellingPrice" placeholder="Selling Price (€)" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Vat Rate (%)" name="vatRate" placeholder="Vat Rate (%)" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Barcode" name="barcode" placeholder="Barcode" fullWidth size="small" />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Stock" name="stockQuantity" placeholder="Stock" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Min. Stock" name="minStockQuantity" placeholder="Min. Stock" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                {carPart && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {carPart.createdAt ? new Date(carPart.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {carPart.updatedAt ? new Date(carPart.updatedAt).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>)}
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
        </BasicLayout >
    )
}