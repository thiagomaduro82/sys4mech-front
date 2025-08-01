import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";
import { ISupplierDetail } from '../supplier/SupplierService';

export interface ICarPartDetail {
    id: number;
    uuid: string;
    name: string;
    description: string;
    costPrice: number;
    sellingPrice: number;
    vatRate: number;
    barcode: string;
    stockQuantity: number;
    minStockQuantity: number;
    supplier: ISupplierDetail;
    createdAt: number;
    updatedAt: number;
};

export interface ICarPartDTO {
    name: string;
    description: string;
    costPrice: number;
    sellingPrice: number;
    vatRate: number;
    barcode: string;
    stockQuantity: number;
    minStockQuantity: number;
    supplierUuid: string;
};

type TCarPartList = {
    content: ICarPartDetail[];
    totalElements: number;
    totalPages: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TCarPartList | Error> => {
    try {
        let urlRelative;
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/car-parts?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/car-parts?${field}=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch car-parts");
    }
};

const getByUuid = async (uuid: string): Promise<ICarPartDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/car-parts/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Car-parts not found");
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
        return new Error("Failed to fetch car-parts by UUID");
    }
};

const create = async (carPartDTO: ICarPartDTO): Promise<ICarPartDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/car-parts`, carPartDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create car-parts");
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
        return new Error("Failed to create car-parts");
    }
};

const update = async (uuid: string, carPartDTO: ICarPartDTO): Promise<ICarPartDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/car-parts/${uuid}`, carPartDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update car-parts");
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
        return new Error("Failed to update car-parts");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/car-parts/${uuid}`, headers);
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
        return new Error("Failed to delete car-parts");
    }
};

export const CarPartService = { getAll, getByUuid, create, update, deleteByUuid };
