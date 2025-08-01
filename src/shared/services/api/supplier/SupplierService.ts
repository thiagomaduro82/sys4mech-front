import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";

export interface ISupplierDetail {
    id: number;
    uuid: string;
    name: string;
    contactName: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    phone: string;
    createdAt: number;
    updatedAt: number;
};

export interface ISupplierDTO {
    name: string;
    email: string;
    contactName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    phone: string;
};

type TSupplierList = {
    content: ISupplierDetail[];
    totalElements: number;
    totalPages: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TSupplierList | Error> => {
    try {
        let urlRelative;
        console.log(`Fetching suppliers with field: ${field}, value: ${value}, pageNumber: ${pageNumber}, pageSize: ${pageSize}, order: ${order}`);
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/suppliers?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/suppliers?${field}=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch suppliers");
    }
};

const getAllList = async (): Promise<ISupplierDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/suppliers/list`, headers);
        if (data) {
            return data;
        }
        return new Error("No suppliers found");
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
        return new Error("Failed to fetch suppliers list");
    }
};

const getByUuid = async (uuid: string): Promise<ISupplierDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/suppliers/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Supplier not found");
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
        return new Error("Failed to fetch supplier by UUID");
    }
};

const create = async (employee: ISupplierDTO): Promise<ISupplierDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/suppliers`, employee, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create supplier");
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
        return new Error("Failed to create supplier");
    }
};

const update = async (uuid: string, employee: ISupplierDTO): Promise<ISupplierDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/suppliers/${uuid}`, employee, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update supplier");
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
        return new Error("Failed to update supplier");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/suppliers/${uuid}`, headers);
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
        return new Error("Failed to delete supplier");
    }
};

export const SupplierService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
