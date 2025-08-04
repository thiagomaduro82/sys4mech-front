import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";
import { ICarPartDetail } from '../car-part/CarPartService';

export interface IServiceOrderPartsDetail {
    id: number;
    carPart: ICarPartDetail;
    quantity: number;
    amount: number;
    createdAt: number;
    updatedAt: number;
};

export interface IServiceOrderPartsDetailDTO {
    serviceOrderUuid: string;
    carPartUuid: string;
    quantity: number;
    amount: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getById = async (id: number): Promise<IServiceOrderPartsDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/service-order-parts/${id}`, headers);
        if (data) {
            return data;
        }
        return new Error("Service order parts not found");
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
        return new Error("Failed to fetch Service order parts by ID");
    }
};

const create = async (serviceOrderPartsDetailDTO: IServiceOrderPartsDetailDTO): Promise<IServiceOrderPartsDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/service-order-parts`, serviceOrderPartsDetailDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create Service order parts");
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
        return new Error("Failed to create Service order parts");
    }
};

const update = async (id: number, serviceOrderPartsDetailDTO: IServiceOrderPartsDetailDTO): Promise<IServiceOrderPartsDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/service-order-parts/${id}`, serviceOrderPartsDetailDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update Service order parts");
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
        return new Error("Failed to update Service order parts");
    }
};

const deleteById = async (id: number): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/service-order-parts/${id}`, headers);
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
        return new Error("Failed to delete Service order parts");
    }
};

export const ServiceOrderPartsService = { getById, create, update, deleteById };
