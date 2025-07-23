import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { ICustomerDetail } from '../customer/CustomerService';


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

const getAllList = async (): Promise<ICustomerCarsDetail[] | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customer-cars`);
        if (data) {
            return data;
        }
        return new Error("No customer cars found");
    } catch (error) {
        return new Error("Failed to fetch customer cars list");
    }
};

const getByUuid = async (uuid: string): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/customer-cars/${uuid}`);
        if (data) {
            return data;
        }
        return new Error("Customer car not found");
    } catch (error) {
        return new Error("Failed to fetch customer car by UUID");
    }
};

const create = async (customerCarDTO: ICustomerCarsDTO): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/customer-cars`, customerCarDTO);
        if (data) {
            return data;
        }
        return new Error("Failed to create customer car");
    } catch (error) {
        return new Error("Failed to create customer car");
    }
};

const update = async (uuid: string, customerCarsDTO: ICustomerCarsDTO): Promise<ICustomerCarsDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/customer-cars/${uuid}`, customerCarsDTO);
        if (data) {
            return data;
        }
        return new Error("Failed to update customer cars");
    } catch (error) {
        return new Error("Failed to update customer cars");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/customer-cars/${uuid}`);
        return;
    } catch (error) {
        return new Error("Failed to delete customer cars");
    }
};

export const CustomerCarsService = { getByUuid, create, update, deleteByUuid, getAllList };
