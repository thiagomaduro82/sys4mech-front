import { Api } from '../axios-config';
import { environment } from "../../../environment";


export interface IPermissionDetail {
    id: number;
    uuid: string;
    name: string;
    description: string;
    createdAt: number;
    updatedAt: number;
};

export interface IPermissionDTO {
    name: string;
    description: string;
};

type TPermissionList = {
    content: IPermissionDetail[];
    totalElements: number;
    totalPages: number;
};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TPermissionList | Error> => {
    try {
        let urlRelative;
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/permissions?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/permissions?field=${field}&value=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch permissions");
    }
};

const getAllList = async (): Promise<IPermissionDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/permissions/list`);
        if (data) {
            return data;
        }
        return new Error("No permissions found");
    } catch (error) {
        return new Error("Failed to fetch permissions list");
    }
};

const getByUuid = async (uuid: string): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/permissions/${uuid}`);
        if (data) {
            return data;
        }
        return new Error("Permission not found");
    } catch (error) {
        return new Error("Failed to fetch permission by UUID");
    }
};

const create = async (role: IPermissionDTO): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/permissions`, role);
        if (data) {
            return data;
        }
        return new Error("Failed to create permission");
    } catch (error) {
        return new Error("Failed to create permission");
    }
};

const update = async (uuid: string, role: IPermissionDTO): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/permissions/${uuid}`, role);
        if (data) {
            return data;
        }
        return new Error("Failed to update permission");
    } catch (error) {
        return new Error("Failed to update permission");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/permissions/${uuid}`);
        return;
    } catch (error) {
        return new Error("Failed to delete permission");
    }
};

export const PermissionService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
