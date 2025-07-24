import { environment } from "../../../environment";
import { Api } from "../axios-config";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";

export interface IRolePermissions {
    id: number | null;
    roleId: number | null;
    permissionId: number | null;
}

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const createRolePermission = async (rolePermission: IRolePermissions): Promise<IRolePermissions | Error> => {
    try {
        console.log("Creating role permission:", rolePermission);
        const { data } = await Api.post(`${environment.apiUrl}/role-permissions`, rolePermission, headers);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403) {
                return new Error("You do not have permission to access this information.");
            }
            if (error.response.status === 401) {
                return new Error("Your session has expired. Please log in again.");
            }
            return new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        }
        return new Error("Failed to create role permission");
    }
}

const getRolePermission = async (roleId: number, permissionId: number): Promise<IRolePermissions | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/role-permissions?roleId=${roleId}&permissionId=${permissionId}`, headers);
        return data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403) {
                return new Error("You do not have permission to access this information.");
            }
            if (error.response.status === 401) {
                return new Error("Your session has expired. Please log in again.");
            }
            return new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        }
        return new Error("Failed to fetch role permission");
    }
}

const deleteRolePermission = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/role-permissions/${id}`, headers);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 403) {
                return new Error("You do not have permission to access this information.");
            }
            if (error.response.status === 401) {
                return new Error("Your session has expired. Please log in again.");
            }
            return new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        }
        return new Error("Failed to delete role permission");
    }
}

export const RolePermissionsService = {
    createRolePermission, getRolePermission, deleteRolePermission
};
