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

export const RolePermissionsService = {
    createRolePermission
};
