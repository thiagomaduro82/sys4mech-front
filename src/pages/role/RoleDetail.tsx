import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useVForm, VTextField } from "../../shared/forms";
import { useEffect, useState } from "react";
import { RoleService } from "../../shared/services/api/role/RoleService";
import { BasicLayout } from "../../shared/layouts";
import { ToolbarDetail } from "../../shared/components";
import { Form } from "@unform/web";
import { Box, Grid, LinearProgress, Paper } from "@mui/material";

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

    const { uuid } = useParams<'uuid'>();
    const navigate = useNavigate();

    const { formRef, save, saveAndClose, isSaveAndClose } = useVForm();
    const [open, setOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (uuid && uuid !== 'create') {
            setIsLoading(true);
            RoleService.getByUuid(uuid).then((response) => {
                setIsLoading(false);
                if (response instanceof Error) {
                    console.error("Error fetching role:", response.message);
                    navigate('/roles');
                } else {
                    formRef.current?.setData(response);
                }
            });
        } else {
            formRef.current?.setData({
                name: ''
            });
        }
    }, [uuid, navigate, formRef]);

    const handleSave = (data: IFormData) => {
        formValidationSchema.validate(data, { abortEarly: false })
            .then((validatedData) => {
                setIsLoading(true);
                if (uuid === 'create') {
                    RoleService.create(validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            if (isSaveAndClose()) {
                                navigate('/role');
                            } else {
                                navigate(`/role/detail/${result.uuid}`);
                            }
                        }
                    });
                } else if (uuid) {
                    RoleService.update(uuid, validatedData).then((result) => {
                        setIsLoading(false);
                        if (result instanceof Error) {
                            alert(result.message);
                        } else {
                            if (isSaveAndClose()) {
                                navigate('/role');
                            }
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
        if (window.confirm('Delete this record?')) {
            RoleService.deleteByUuid(uuid).then(result => {
                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    alert('Record deleted successful');
                    navigate('/role');
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
                    onBtnNew={() => navigate('/role/detail/create')}
                    onBtnDelete={() => { if (uuid) handleDelete(uuid); }}
                    onBtnBack={() => navigate('/role')}
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
                            
                        </Grid>
                    </Box >
                </Box>
            </Form >
        </BasicLayout >
    );
};