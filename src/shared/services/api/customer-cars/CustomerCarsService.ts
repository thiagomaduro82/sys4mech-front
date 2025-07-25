import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { ICustomerDetail } from '../customer/CustomerService';
import axios from "axios";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';

export interface ICustomerCarsDetail {
    id: number;
    uuid: string;
    make: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    vin: string;
    customer: ICustomerDetail;
    createdAt: number;
    updatedAt: number;
};

export interface ICustomerCarsDTO {
    make: string;
    model: string;
    year: number;
    color: string;
    registrationNumber: string;
    vin: string;
    customerUuid: string;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAllList = async (): Promise<ICustomerCarsDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customer-cars`, headers);
        if (data) {
            return data;
        }
        return new Error("No customer cars found");
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
        return new Error("Failed to fetch customer cars list");
    }
};

const getByUuid = async (uuid: string): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customer-cars/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Customer car not found");
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
        return new Error("Failed to fetch customer car by UUID");
    }
};

const create = async (customerCarDTO: ICustomerCarsDTO): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/customer-cars`, customerCarDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create customer car");
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
        return new Error("Failed to create customer car");
    }
};

const update = async (uuid: string, customerCarsDTO: ICustomerCarsDTO): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/customer-cars/${uuid}`, customerCarsDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update customer cars");
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
        return new Error("Failed to update customer cars");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/customer-cars/${uuid}`, headers);
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
        return new Error("Failed to delete customer cars");
    }
};

export const CustomerCarsService = { getByUuid, create, update, deleteByUuid, getAllList };
