import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicLayout } from "../../shared/layouts";
import { ModalDialog, ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import { ISupplierDetail, SupplierService } from "../../shared/services/api/supplier/SupplierService";

const formValidationSchema: yup.Schema = yup.object().shape({
    name: yup.string().required().min(1).max(100),
    contactName: yup.string().required().min(1).max(100),
    email: yup.string().email().required(),
    addressLine1: yup.string().required().max(100),
    addressLine2: yup.string().max(100),
    city: yup.string().required().max(50),
    county: yup.string().max(50),
    postalCode: yup.string().required().max(20),
    country: yup.string().required().max(50),
    phone: yup.string().required().max(20)
});
    
export const SupplierDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [supplier, setSupplier] = useState<ISupplierDetail | null>(null);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            SupplierService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying supplier data', '');
                    navigate('/suppliers');
                } else {
                    setSupplier(result);
                    formRef.current?.setData(result);
                }
            });
        } else {
            setSupplier(null);
            formRef.current?.setData({
                name: '',
                contactName: '',
                email: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                county: '',
                postalCode: '',
                country: '',
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
        if (isSaveAndClose() || titleModal.includes('deleted')) {
            navigate('/suppliers');
        } else {
            navigate(`/suppliers/detail/${supplier?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: ISupplierDetail) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    SupplierService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding supplier', result.message);
                        } else {
                            setSupplier(result);
                            handleOpenModal('success', 'Supplier added successfully', '');
                        }
                    });
                } else {
                    SupplierService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing supplier', result.message);
                        } else {
                            setSupplier(result);
                            handleOpenModal('success', 'Supplier updated successfully', '');
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
        setTitleModal('Delete Supplier');
        setMessageModal('Are you sure you want to delete this supplier? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            SupplierService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting supplier', result.message);
                    } else {
                        handleOpenModal('success', 'Supplier deleted successfully', '');
                    }
                });
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New Supplier" : "Supplier detail"} icon="widgets"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/suppliers/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/suppliers')}
                />
            }>
            <Form ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                    <Box margin={1} component={Paper} sx={{ width: { lg: '70%', xl: '70%' } }} >
                        <Grid container direction={'column'} padding={2} spacing={2} >
                            {isLoading && (
                                <Grid>
                                    <LinearProgress />
                                </Grid>
                            )}
                            <Grid container spacing={2} padding={3}>
                                <Grid size={6}>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                                <Grid size={6}>
                                    <VTextField label="Contact Name" name="contactName" placeholder="Contact Name" fullWidth size="small" />
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
                                <Grid size={4}>
                                    <VTextField label="Country" name="country" placeholder="Country" fullWidth size="small" />
                                </Grid>
                                <Grid size={2}>
                                    <VTextField label="Phone" name="phone" placeholder="Phone" fullWidth size="small" />
                                </Grid>

                                {supplier && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleDateString() : 'N/A'}
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
