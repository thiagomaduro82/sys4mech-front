import { Api } from '../axios-config';
import { environment } from "../../../environment";
import axios from "axios";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';

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

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TPermissionList | Error> => {
    try {
        let urlRelative;
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/permissions?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/permissions?field=${field}&value=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        };
        const { data } = await Api.get(urlRelative, headers);
        if (data) {
            return {
                content: data.content,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            };
        }
        return new Error("No data found");
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
        return new Error("Failed to fetch permissions");
    }
};

const getAllList = async (): Promise<IPermissionDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/permissions/list`, headers);
        if (data) {
            return data;
        }
        return new Error("No permissions found");
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
        return new Error("Failed to fetch permissions list");
    }
};

const getByUuid = async (uuid: string): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/permissions/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Permission not found");
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
        return new Error("Failed to fetch permission by UUID");
    }
};

const create = async (permission: IPermissionDTO): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/permissions`, permission, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create permission");
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
        return new Error("Failed to create permission");
    }
};

const update = async (uuid: string, permission: IPermissionDTO): Promise<IPermissionDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/permissions/${uuid}`, permission, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update permission");
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
        return new Error("Failed to update permission");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/permissions/${uuid}`, headers);
        return;
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
        return new Error("Failed to delete permission");
    }
};

export const PermissionService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
