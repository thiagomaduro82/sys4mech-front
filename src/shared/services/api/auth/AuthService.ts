import { environment } from "../../../environment";
import { Api } from "../axios-config";

export interface ILoginDTO {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    permissions: string[];
}

const login = async (data: ILoginDTO): Promise<ILoginResponse | Error> => {
    try {
        const response = await Api.post(`${environment.apiUrl}/auth/login`, data);
        if (response.data) {
            return response.data;
        }
        return new Error("Login failed - message: " + response);
    } catch (error) {
        return new Error("Login failed - message: " + error);
    }
};

const getMyPermissions = async (token: string): Promise<string[] | Error> => {
    try {
        const { data } = await Api.get('/auth/me/permissions', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data;
    } catch (error) {
        return new Error("Failed to fetch permissions - message: " + error);
    }
};

export const AuthService = { login, getMyPermissions };