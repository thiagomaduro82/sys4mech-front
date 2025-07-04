import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { IPermissionDetail } from '../permission/PermissionService';


export interface IRoleDetail {
    id: number;
    uuid: string;
    name: string;
    permissions: IPermissionDetail[];
    createdAt: number;
    updatedAt: number;
};

export interface IRoleDTO {
    name: string;
};

type TRoleList = {
    content: IRoleDetail[];
    totalElements: number;
    totalPages: number;
};

const getAll = async (name = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TRoleList | Error> => {
    try {
        let urlRelative;
        if (name === undefined || name === null || name === '') {
            urlRelative = environment.apiUrl + `/roles?page=${pageNumber}&size=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/roles?name=${name}&page=${pageNumber}&size=${pageSize}&order=${order}`;
        };
        const { data } = await Api.get(urlRelative);
        if (data) {
            return {
                content: data.content,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            };
        }
        return new Error("No data found");
    } catch (error) {
        return new Error("Failed to fetch roles");
    }
};

const getAllList = async (): Promise<IRoleDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/roles/list`);
        if (data) {
            return data;
        }
        return new Error("No roles found");
    } catch (error) {
        return new Error("Failed to fetch roles list");
    }
};

const getByUuid = async (uuid: string): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/roles/${uuid}`);
        if (data) {
            return data;
        }
        return new Error("Role not found");
    } catch (error) {
        return new Error("Failed to fetch role by UUID");
    }
};

const create = async (role: IRoleDTO): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/roles`, role);
        if (data) {
            return data;
        }
        return new Error("Failed to create role");
    } catch (error) {
        return new Error("Failed to create role");
    }
};

const update = async (uuid: string, role: IRoleDTO): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/roles/${uuid}`, role);
        if (data) {
            return data;
        }
        return new Error("Failed to update role");
    } catch (error) {
        return new Error("Failed to update role");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/roles/${uuid}`);
        return;
    } catch (error) {
        return new Error("Failed to delete role");
    }
};

export const RoleService = { getAll, getAllList, getByUuid, create, update, deleteByUuid };
