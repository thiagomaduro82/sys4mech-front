import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { LOCAL_STORAGE_TOKEN_KEY } from '../../../contexts';
import axios from "axios";
import { ICustomerDetail } from '../customer/CustomerService';
import { ICustomerCarsDetail } from '../customer-cars/CustomerCarsService';
import { IEmployeeDetail } from '../employee/EmployeeService';
import { IServiceOrderServicesDetail } from './ServiceOrderServicesService';
import { IServiceOrderPartsDetail } from './ServiceOrderPartsService';

export interface IServiceOrderDetail {
    id: number;
    uuid: string;
    customer: ICustomerDetail;
    customerCar: ICustomerCarsDetail;
    employee: IEmployeeDetail;
    status: string;
    workRequired: string;
    observations: string;
    serviceOrderParts: IServiceOrderPartsDetail[];
    serviceOrderServices: IServiceOrderServicesDetail[];
    createdAt: number;
    updatedAt: number;
};

export interface IServiceOrderDetailDTO {
    customerUuid: string;
    customerCarUuid: string;
    employeeUuid: string;
    status: string;
    workRequired: string;
    observations: string;
};

type TCarPartList = {
    content: IServiceOrderDetail[];
    totalElements: number;
    totalPages: number;
};

const storedToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
const token = storedToken ? JSON.parse(storedToken) : undefined;
const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const getAll = async (pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TCarPartList | Error> => {
    try {
        let urlRelative = environment.apiUrl + `/service-orders?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch service order");
    }
};

const getByUuid = async (uuid: string): Promise<IServiceOrderDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/service-orders/${uuid}`, headers);
        if (data) {
            return data;
        }
        return new Error("Service order not found");
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
        return new Error("Failed to fetch service order by UUID");
    }
};

const create = async (serviceOrderDTO: IServiceOrderDetailDTO): Promise<IServiceOrderDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/service-orders`, serviceOrderDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to create service order");
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
        return new Error("Failed to create service order");
    }
};

const update = async (uuid: string, serviceOrderDTO: IServiceOrderDetailDTO): Promise<IServiceOrderDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/service-orders/${uuid}`, serviceOrderDTO, headers);
        if (data) {
            return data;
        }
        return new Error("Failed to update service order");
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
        return new Error("Failed to update service order");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/service-orders/${uuid}`, headers);
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
        return new Error("Failed to delete service order");
    }
};

export const ServiceOrderService = { getAll, getByUuid, create, update, deleteByUuid };
