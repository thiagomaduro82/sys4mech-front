import { Api } from '../axios-config';
import { environment } from "../../../environment";


export interface ICustomerDetail {
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

export interface ICustomerDTO {
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

type TCustomerList = {
    content: ICustomerDetail[];
    totalElements: number;
    totalPages: number;
};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TCustomerList | Error> => {
    try {
        let urlRelative;
        console.log(`Fetching employees with field: ${field}, value: ${value}, pageNumber: ${pageNumber}, pageSize: ${pageSize}, order: ${order}`);
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/customers?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/customers?${field}=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        };
        const { data } = await Api.get(urlRelative);
        if (data) {
            return {
                content: data.content,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            };
        }
        return new Error("No data found");
    } catch (error) {
        return new Error("Failed to fetch customers");
    }
};

const getAllList = async (): Promise<ICustomerDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customers/list`);
        if (data) {
            return data;
        }
        return new Error("No customers found");
    } catch (error) {
        return new Error("Failed to fetch customers list");
    }
};

const getByUuid = async (uuid: string): Promise<ICustomerDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customers/${uuid}`);
        if (data) {
            return data;
        }
        return new Error("Customer not found");
    } catch (error) {
        return new Error("Failed to fetch customer by UUID");
    }
};

const create = async (employee: ICustomerDTO): Promise<ICustomerDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/customers`, employee);
        if (data) {
            return data;
        }
        return new Error("Failed to customer employee");
    } catch (error) {
        return new Error("Failed to customer employee");
    }
};

const update = async (uuid: string, employee: ICustomerDTO): Promise<ICustomerDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/customers/${uuid}`, employee);
        if (data) {
            return data;
        }
        return new Error("Failed to update customer");
    } catch (error) {
        return new Error("Failed to update customer");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/customers/${uuid}`);
        return;
    } catch (error) {
        return new Error("Failed to delete customer");
    }
};

export const CustomerService = { getAll, getByUuid, create, update, deleteByUuid, getAllList };
