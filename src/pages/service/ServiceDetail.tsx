import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicLayout } from "../../shared/layouts";
import { ModalDialog, ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { VSwitch, VTextField, useVForm } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import { IServiceDetail, IServiceDTO, ServiceService } from "../../shared/services/api/service/ServiceService";

const formValidationSchema: yup.Schema = yup.object().shape({
    name: yup.string().required().min(5).max(100),
    amount: yup.number().required().positive(),
    vatRate: yup.number().required().min(0).max(100),
    electronicDiagnosis: yup.boolean().required()
});

export const ServiceDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [service, setService] = useState<IServiceDetail | null>(null);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            ServiceService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying service data', '');
                    navigate('/services');
                } else {
                    setService(result);
                    formRef.current?.setData(result);
                }
            });
        } else {
            setService(null);
            formRef.current?.setData({
                name: '',
                amount: '',
                vatRate: ''
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
            navigate('/services');
        } else {
            navigate(`/services/detail/${service?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: IServiceDTO) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    ServiceService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding service', result.message);
                        } else {
                            setService(result);
                            handleOpenModal('success', 'Service added successfully', '');
                        }
                    });
                } else {
                    ServiceService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing service', result.message);
                        } else {
                            setService(result);
                            handleOpenModal('success', 'Service updated successfully', '');
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
        setTitleModal('Delete Service');
        setMessageModal('Are you sure you want to delete this service? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            ServiceService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting service', result.message);
                    } else {
                        handleOpenModal('success', 'Service deleted successfully', '');
                    }
                });
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New Service" : "Service detail"} icon="handyman"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/services/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/services')}
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
                                <Grid size={4}>
                                    <VTextField label="Amount (€)" name="amount" placeholder="Amount" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VTextField label="Vat Rate (%)" name="vatRate" placeholder="Vat Rate" fullWidth size="small"
                                        type={'number'} inputProps={{ step: "0.01", min: "0", max: "100" }} />
                                </Grid>
                                <Grid size={4}>
                                    <VSwitch name="electronicDiagnosis" label="Electronic Diagnosis" />
                                </Grid>
                                {service && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {service.updatedAt ? new Date(service.updatedAt).toLocaleDateString() : 'N/A'}
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
