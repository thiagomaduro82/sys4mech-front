import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useVForm, VTextField } from "../../shared/forms";
import { useEffect, useState } from "react";
import { IUserAddDTO, IUserDetail, UserService } from "../../shared/services/api/user/UserService";
import { BasicLayout } from "../../shared/layouts";
import { AutoCompleteRole, ModalDialog, ToolbarDetail } from "../../shared/components";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { Form } from "@unform/web";

const formValidationSchema: yup.Schema = yup.object().shape({
    name: yup.string().required().min(5).max(60),
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
    roleUuid: yup.string().required(),
});

export const UserDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [titleModal, setTitleModal] = useState<string>('');
    const [typeModal, setTypeModal] = useState<'info' | 'warning' | 'error' | 'success' | 'confirmation'>('info');
    const [messageModal, setMessageModal] = useState<string>('');
    const [user, setUser] = useState<IUserDetail | null>(null);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            UserService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                console.log(uuid, result);
                if (result instanceof Error) {
                    handleOpenModal('error', 'Error displaying user data', '');
                    navigate('/users');
                } else {
                    setUser(result);
                    formRef.current?.setData({
                        name: result.name,
                        email: result.email,
                        password: result.password,
                        roleUuid: result.role.uuid,
                    });
                }
            });
        } else {
            setUser(null);
            formRef.current?.setData({
                name: '',
                email: '',
                password: '',
                roleUuid: ''
            })
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
            navigate('/users');
        } else {
            navigate(`/users/detail/${user?.uuid || 'create'}`);
        }
    };

    const handleSave = (data: IUserAddDTO) => {
        console.log('handleSave', data);
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    UserService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error adding user', result.message);
                        } else {
                            setUser(result);
                            handleOpenModal('success', 'User added successfully', '');
                        }
                    });
                } else {
                    UserService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            handleOpenModal('error', 'Error changing user', result.message);
                        } else {
                            setUser(result);
                            handleOpenModal('success', 'User updated successfully', '');
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
        setMessageModal('Are you sure you want to delete this user? This action cannot be undone.');
        setOpenModal(true);
    };

    const handleDelete = (uuid: string) => {
        if (uuid !== 'create') {
            UserService.deleteByUuid(uuid)
                .then((result) => {
                    if (result instanceof Error) {
                        handleOpenModal('error', 'Error deleting user', result.message);
                    } else {
                        handleOpenModal('success', 'User deleted successfully', '');
                    }
                });
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New User" : "User detail"} icon="person"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/users/detail/create')}
                    onBtnDelete={() => handleDeleteConfirmation()}
                    onBtnBack={() => navigate('/users')}
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
                                <Grid size={16}>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                                <Grid size={16}>
                                    <VTextField label="Email" name="email" placeholder="Email" fullWidth size="small" />
                                </Grid>
                                <Grid size={16}>
                                    <VTextField
                                        disabled={uuid !== 'create'}
                                        label="Password"
                                        name="password"
                                        placeholder="Password"
                                        fullWidth
                                        type="password"
                                        size="small" />
                                </Grid>
                                <Grid size={16}>
                                    <AutoCompleteRole isExternalLoading={isLoading} />
                                </Grid>
                                {user && (<Grid size={16} >
                                    <Typography variant="caption">
                                        <strong>Created at</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} <br />
                                        <strong>Updated at</strong> {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
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