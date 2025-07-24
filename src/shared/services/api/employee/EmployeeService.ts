import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";

export interface IEmployeeDetail {
    id: number;
    uuid: string;
    name: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    dateOfBirth: Date;
    phone: string;
    createdAt: number;
    updatedAt: number;
};

export interface IEmployeeDTO {
    name: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
    dateOfBirth: Date;
    phone: string;
};

type TEmployeeList = {
    content: IEmployeeDetail[];
    totalElements: number;
    totalPages: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TEmployeeList | Error> => {
    try {
        let urlRelative;
        console.log(`Fetching employees with field: ${field}, value: ${value}, pageNumber: ${pageNumber}, pageSize: ${pageSize}, order: ${order}`);
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/employees?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/employees?${field}=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch employees");
    }
};

const getAllList = async (): Promise<IEmployeeDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/employees/list`, headers);
        if (data) {
            return data;
        }
        return new Error("No employees found");
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
        return new Error("Failed to fetch employees list");
    }
};

const getByUuid = async (uuid: string): Promise<IEmployeeDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/employees/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Employee not found");
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
        return new Error("Failed to fetch employee by UUID");
    }
};

const create = async (employee: IEmployeeDTO): Promise<IEmployeeDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/employees`, employee, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create employee");
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
        return new Error("Failed to create employee");
    }
};

const update = async (uuid: string, employee: IEmployeeDTO): Promise<IEmployeeDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/employees/${uuid}`, employee, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update employee");
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
        return new Error("Failed to update employee");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/employees/${uuid}`, headers);
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
        return new Error("Failed to delete employee");
    }
};

export const EmployeeService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
