import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";
import { IServiceDetail } from '../service/ServiceService';

export interface IServiceOrderServicesDetail {
    id: number;
    service: IServiceDetail;
    quantity: number;
    amount: number;
    createdAt: number;
    updatedAt: number;
};

export interface IServiceOrderServicesDetailDTO {
    serviceOrderUuid: string;
    serviceUuid: string;
    quantity: number;
    amount: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getById = async (id: number): Promise<IServiceOrderServicesDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/service-order-services/${id}`, headers);
        if (data) {
            return data;
        }
        return new Error("Service order services not found");
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
        return new Error("Failed to fetch Service order services by ID");
    }
};

const create = async (serviceOrderServicesDetailDTO: IServiceOrderServicesDetailDTO): Promise<IServiceOrderServicesDetail | Error> => {
    try {
        console.log(serviceOrderServicesDetailDTO);
        const { data } = await Api.post(`${environment.apiUrl}/service-order-services`, serviceOrderServicesDetailDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create Service order services");
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
        return new Error("Failed to create Service order services");
    }
};

const update = async (id: number, serviceOrderServicesDetailDTO: IServiceOrderServicesDetailDTO): Promise<IServiceOrderServicesDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/service-order-services/${id}`, serviceOrderServicesDetailDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update Service order services");
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
        return new Error("Failed to update Service order services");
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/service-order-services/${id}`, headers);
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
        return new Error("Failed to delete Service order services");
    }
};

export const ServiceOrderServicesService = { getById, create, update, deleteById };
