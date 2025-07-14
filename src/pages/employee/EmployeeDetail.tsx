import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicLayout } from "../../shared/layouts";
import { ModalDialog, ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";
import { EmployeeService, IEmployeeDetail } from "../../shared/services/api/employee/EmployeeService";

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
    
export const EmployeeDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [employee, setEmployee] = useState<IEmployeeDetail | null>(null);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            EmployeeService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying employee data', '');
                    navigate('/employees');
                } else {
                    setEmployee(result);
                    formRef.current?.setData(result);
                }
            });
        } else {
            setEmployee(null);
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
        if (isSaveAndClose() || titleModal.includes('deleted')) {
            navigate('/employees');
        } else {
            navigate(`/employees/detail/${employee?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: IEmployeeDetail) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    EmployeeService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding employee', result.message);
                        } else {
                            setEmployee(result);
                            handleOpenModal('success', 'Employee added successfully', '');
                        }
                    });
                } else {
                    EmployeeService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing employee', result.message);
                        } else {
                            setEmployee(result);
                            handleOpenModal('success', 'Employee updated successfully', '');
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
        setTitleModal('Delete Employee');
        setMessageModal('Are you sure you want to delete this employee? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            EmployeeService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting employee', result.message);
                    } else {
                        handleOpenModal('success', 'Employee deleted successfully', '');
                    }
                });
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New Employee" : "Employee detail"} icon="person_3"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/employees/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/employees')}
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
                                    <VTextField label="Date Of Birth" name="dateOfBirth" placeholder="Date Of Birth" fullWidth size="small" type={'date'}/>
                                </Grid>
                                <Grid size={3}>
                                    <VTextField label="Phone" name="phone" placeholder="Phone" fullWidth size="small" />
                                </Grid>

                                {employee && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString() : 'N/A'}
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
