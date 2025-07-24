import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { IPermissionDetail } from '../permission/PermissionService';
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";

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

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (name = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TRoleList | Error> => {
    try {
        let urlRelative;
        if (name === undefined || name === null || name === '') {
            urlRelative = environment.apiUrl + `/roles?page=${pageNumber}&size=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/roles?name=${name}&page=${pageNumber}&size=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch roles");
    }
};

const getAllList = async (): Promise<IRoleDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/roles/list`, headers);
        if (data) {
            return data;
        }
        return new Error("No roles found");
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
        return new Error("Failed to fetch roles list");
    }
};

const getByUuid = async (uuid: string): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/roles/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Role not found");
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
        return new Error("Failed to fetch role by UUID");
    }
};

const create = async (role: IRoleDTO): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/roles`, role, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create role");
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
        return new Error("Failed to create role");
    }
};

const update = async (uuid: string, role: IRoleDTO): Promise<IRoleDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/roles/${uuid}`, role, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update role");
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
        return new Error("Failed to update role");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/roles/${uuid}`, headers);
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
        return new Error("Failed to delete role");
    }
};

export const RoleService = { getAll, getAllList, getByUuid, create, update, deleteByUuid };
