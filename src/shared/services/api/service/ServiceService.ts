import { Api } from '../axios-config';
import { environment } from "../../../environment";
import axios from "axios";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';

export interface IServiceDetail {
    id: number;
    uuid: string;
    name: string;
    amount: number;
    vatRate: number;
    electronicDiagnosis: boolean;
    createdAt: number;
    updatedAt: number;
};

export interface IServiceDTO {
    name: string;
    amount: number;
    vatRate: number;
    electronicDiagnosis: boolean;
};

type TServiceList = {
    content: IServiceDetail[];
    totalElements: number;
    totalPages: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TServiceList | Error> => {
    try {
        let urlRelative;
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/services?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/services?${field}=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch services");
    }
};

const getAllList = async (): Promise<IServiceDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/services/list`, headers);
        if (data) {
            return data;
        }
        return new Error("No services found");
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
        return new Error("Failed to fetch services list");
    }
};

const getByUuid = async (uuid: string): Promise<IServiceDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/services/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Service not found");
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
        return new Error("Failed to fetch service by UUID");
    }
};

const create = async (service: IServiceDTO): Promise<IServiceDetail | Error> => {
    try {
        const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
        const token = storedToken ? JSON.parse(storedToken) : undefined;
        const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        console.log(headers);
        const { data } = await Api.post(`${environment.apiUrl}/services`, service, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create service");
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
        return new Error("Failed to create service");
    }
};

const update = async (uuid: string, service: IServiceDTO): Promise<IServiceDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/services/${uuid}`, service, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update service");
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
        return new Error("Failed to update service");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/services/${uuid}`, headers);
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
        return new Error("Failed to delete service");
    }
};

export const ServiceService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
