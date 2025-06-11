import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BasicLayout } from "../../shared/layouts";
import { ToolbarDetail } from "../../shared/components";
import { IPermissionDetail, PermissionService } from "../../shared/services/api/permission/PermissionService";
import { Form } from "@unform/web";
import { VTextField, useVForm } from "../../shared/forms";
import { Box, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import * as yup from "yup";

const formValidationSchema: yup.Schema = yup.object().shape({ 
    name: yup.string().required().min(5).max(60),
    description: yup.string().required().min(5).max(255)
});

export const PermissionDetail: React.FC = () => {

    const { uuid = 'create' } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (uuid !== 'create') {
            setIsLoading(true);
            PermissionService.getByUuid(uuid).then((result) => {
                setIsLoading(false);
                if (result instanceof Error) {
                    alert(result.message);
                    navigate('/permissions');
                } else {
                    formRef.current?.setData(result);
                }
            });
        } else {
            formRef.current?.setData({
                uuid: '',
                name: '',
                description: ''
            })
        }
    }, [uuid, navigate, formRef]);

    const handleSave = (data: IPermissionDetail) => {
        formValidationSchema.validate(data, {abortEarly: false})
        .then((validatedData) => {
            setIsLoading(true);
            if (uuid === 'create') {
                PermissionService.create(validatedData).then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        if (isSaveAndClose()) {
                            navigate('/permissions');
                        } else {
                            navigate(`/permissions/detail/${result.uuid}`);
                        }
                    }
                });
            } else {
                PermissionService.update(uuid, validatedData).then((result) => {
                    setIsLoading(false);
                    if (result instanceof Error) {
                        alert(result.message);
                    } else {
                        if (isSaveAndClose()) {
                            navigate('/permissions');
                        }
                    }
                });
            }
        }).catch((errors: yup.ValidationError) => {
            const validationErrors: {[key: string]: string} = {};
            errors.inner.forEach(error => {
                if (!error.path) return;
                validationErrors[error.path] = error.message;
                formRef.current?.setErrors(validationErrors);
            })
        });
    }

    const handleDelete = (uuid: string) => {
        if (window.confirm('Delete this permission?')) {
            PermissionService.deleteByUuid(uuid).then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert('Record deleted successful');
                    navigate('/permissions');
                }
            })
        }
    };

    return (
        <BasicLayout title={uuid === 'create' ? "New Permission" : "Permission detail"} icon="security"
            toolbar={
                <ToolbarDetail
                    showBtnSave
                    showBtnSaveAndBack
                    showBtnBack 
                    showBtnDelete={uuid !== 'create'}
                    showBtnNew={uuid !== 'create'}

                    onBtnSave={save}
                    onBtnSaveAndBack={saveAndClose}
                    onBtnNew={() => navigate('/permission/detail/create')}
                    onBtnDelete={() => handleDelete(uuid)}
                    onBtnBack={() => navigate('/permission')}
                />
            }>
            <Form ref={formRef} onSubmit={handleSave} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Box display={"flex"} flexDirection={"column"} sx={{ p: 1, m: 1, width: 'auto' }} alignItems={"center"}>
                    <Box margin={1} component={Paper} boxShadow={8} sx={{ width: { lg: '70%', xl: '50%' } }} >
                        <Grid container padding={2} spacing={2} >
                            {isLoading && (
                                <Grid>
                                    <LinearProgress />
                                </Grid>
                            )}
                            <Grid>
                                <Typography variant="h6"></Typography>
                            </Grid>
                            <Grid container direction={"row"} spacing={2} >
                                <Grid>
                                    <VTextField label="UUID" name="uuid" placeholder="UUID" fullWidth size="small" disabled />
                                </Grid>
                                <Grid>
                                    <VTextField label="Name" name="name" placeholder="Name" fullWidth size="small" />
                                </Grid>
                            </Grid>
                            <Grid container direction={"row"} spacing={2}>
                                <Grid>
                                    <VTextField label="Description" name="description" placeholder="Description" fullWidth size="small" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box >
                </Box>
            </Form >
        </BasicLayout >
    )
}
