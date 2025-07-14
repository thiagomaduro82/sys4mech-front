import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import { useAuthContext } from "../../contexts";
import { useEffect, useState } from "react";
import * as yup from "yup";
import logo from '../../../assets/images/logo.png';

interface ILoginProps {
    children: React.ReactNode;
}

const loginSchema: yup.Schema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(6),
});

export const Login: React.FC<ILoginProps> = ({ children }) => {

    const { isAuthenticated, login, loading } = useAuthContext();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string>();
    const [passwordError, setPasswordError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            setEmail('');
            setPassword('');
            setEmailError(undefined);
            setPasswordError(undefined);
        }
    }, [isAuthenticated]);

    const handleSubmit = async () => {
        setIsLoading(true);
        loginSchema.validate({ email, password }, { abortEarly: false })
            .then(async (validData) => {
                await login(validData).then((response) => {
                    setIsLoading(false);
                    if (response instanceof Error) {
                        alert(response.message);
                    }
                });
            })
            .catch((errors: yup.ValidationError) => {
                setIsLoading(false);
                errors.inner.forEach((error) => {
                    if (error.path === 'email') {
                        setEmailError(error.message);
                    } else if (error.path === 'password') {
                        setPasswordError(error.message);
                    }
                });
            });
    };

    if (isAuthenticated) {
        if (loading) {
            return (
                <Box width={'100vw'} height={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            );
        }
        return (<>{children}</>);
    }

    return (
        <Box width={'100vw'} height={'100vh'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Card>
                <CardContent>
                    <Box display={'flex'} flexDirection={'column'} gap={2} width={300} alignItems={'center'} alignContent={'center'}>
                        <img src={logo} style={{ width: '80%', height: 'auto' }} alt="Logo" />
                        <Typography variant={'h6'}>Login</Typography>
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!emailError}
                            helperText={emailError}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={() => setEmailError('')}
                            disabled={isLoading}
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={() => setPasswordError('')}
                            fullWidth
                            error={!!passwordError}
                            helperText={passwordError}
                            disabled={isLoading}
                        />
                    </Box>
                </CardContent>
                <CardActions>
                    <Box width={'100%'} display={'flex'} justifyContent={'center'} paddingBottom={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit()}
                            disabled={isLoading}
                            endIcon={isLoading ? <CircularProgress variant={'indeterminate'} color={'inherit'} size={20} /> : undefined}
                        >
                            Login
                        </Button>
                    </Box>
                </CardActions>
            </Card>
        </Box>
    );
}