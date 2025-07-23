import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthService, ILoginDTO, ILoginResponse } from "../services/api/auth/AuthService";

interface IAuthContextData {
    isAuthenticated: boolean;
    login: (loginDTO: ILoginDTO) => Promise<ILoginResponse | Error>;
    logout: () => void;
    permissions: string[];
    loading: boolean;
    refreshPermissions: (token: string) => Promise<void>;
};

const AuthContext = React.createContext({} as IAuthContextData);

export const LOCAL_STORAGE_TOKEN_KEY = 'APP_TOKEN';

interface IAuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {

    const [token, setToken] = useState<string>();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const refreshPermissions = useCallback(async (token: string) => {
        const perms = await AuthService.getMyPermissions(token);
        setPermissions(Array.isArray(perms) ? perms : []);
        if (permissions.length === 0) {
            setToken(undefined);
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        }
    }, [permissions.length]);

    useEffect(() => {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
        const parsedToken = storedToken ? JSON.parse(storedToken) : undefined;
        setToken(parsedToken);
        if (parsedToken) {
            AuthService.getMyPermissions(parsedToken).then((response) => {
                if (response instanceof Error) {
                    console.error("Failed to fetch permissions:", response.message);
                    setToken(undefined);
                    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
                } else {
                    setPermissions(response);
                }
            });
        }
        setIsLoading(false);
    }, []);

    const handleLogin = useCallback(async (loginDTO: ILoginDTO): Promise<ILoginResponse | Error> => {
        setIsLoading(true);
        setPermissions([]);
        setToken(undefined);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        const loginResponse = await AuthService.login(loginDTO);
        if (loginResponse instanceof Error) {
            setIsLoading(false);
            return new Error(loginResponse.message);
        } else {
            setToken(loginResponse.token);
            setPermissions(loginResponse.permissions);
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, JSON.stringify(loginResponse.token));
            setIsLoading(false);
            return loginResponse;
        }
    }, []);

    const handleLogout = useCallback(() => {
        setToken(undefined);
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    }, []);

    const isAuthenticated = useMemo(() => !!token, [token]);
    const permissionList = useMemo(() => { return permissions; }, [permissions]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated, login: handleLogin,
            logout: handleLogout, permissions: permissionList,
            loading: isLoading, refreshPermissions
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
