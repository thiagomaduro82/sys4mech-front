import { environment } from "../../../environment";
import { Api } from "../axios-config";

export interface IRolePermissions {
    id: number | null;
    roleId: number | null;
    permissionId: number | null;
}

const createRolePermission = async (rolePermission: IRolePermissions): Promise<IRolePermissions | Error> => {
    try {
        console.log("Creating role permission:", rolePermission);
        const { data } = await Api.post(`${environment.apiUrl}/role-permissions`, rolePermission);
        return data;
    } catch (error) {
        return new Error("Failed to create role permission");
    }
}

const getRolePermission = async (roleId: number, permissionId: number): Promise<IRolePermissions | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/role-permissions?roleId=${roleId}&permissionId=${permissionId}`);
        return data;
    } catch (error) {
        return new Error("Failed to fetch role permission");
    }
}

const deleteRolePermission = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/role-permissions/${id}`);
    } catch (error) {
        return new Error("Failed to delete role permission");
    }
}

export const RolePermissionsService = {
    createRolePermission, getRolePermission, deleteRolePermission
};
