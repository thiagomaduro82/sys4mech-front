import { Api } from '../axios-config';
import { environment } from "../../../environment";
import { IRoleDetail } from '../role/RoleService';

export interface IUserDetail {
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string;
    role: IRoleDetail;
    createdAt: number;
    updatedAt: number;
};

export interface IUserAddDTO {
    name: string;
    email: string;
    password: string;
    roleUuid: string;
};

export interface IUserUpdateDTO {
    name: string;
    email: string;
    roleUuid: string;
};

export interface IUserChangePassword {
    newPassword: string;
};

type TUserList = {
    content: IUserDetail[];
    totalElements: number;
    totalPages: number;
};

const getAll = async (field = '', value = '', pageNumber = 0, pageSize = 10, order = 'asc'): Promise<TUserList | Error> => {
    try {
        let urlRelative;
        if (field === undefined || field === null || field === '') {
            urlRelative = environment.apiUrl + `/users?pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
        } else {
            urlRelative = environment.apiUrl + `/users?field=${field}&value=${value}&pageNumber=${pageNumber}&pageSize=${pageSize}&order=${order}`;
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
        return new Error("Failed to fetch users");
    }
};

const getByUuid = async (uuid: string): Promise<IUserDetail | Error> => {
    try {
        const { data } = await Api.get(`${environment.apiUrl}/users/${uuid}`);
        if (data) {
            return data;
        }
        return new Error("User not found");
    } catch (error) {
        return new Error("Failed to fetch user by UUID");
    }
};

const create = async (userAdd: IUserAddDTO): Promise<IUserDetail | Error> => {
    try {
        const { data } = await Api.post(`${environment.apiUrl}/users`, userAdd);
        if (data) {
            return data;
        }
        return new Error("Failed to create user");
    } catch (error) {
        return new Error("Failed to create user");
    }
};

const update = async (uuid: string, roleUpd: IUserUpdateDTO): Promise<IUserDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/users/${uuid}`, roleUpd);
        if (data) {
            return data;
        }
        return new Error("Failed to update user");
    } catch (error) {
        return new Error("Failed to update user");
    }
};

const deleteByUuid = async (uuid: string): Promise<void | Error> => {
    try {
        await Api.delete(`${environment.apiUrl}/users/${uuid}`);
        return;
    } catch (error) {
        return new Error("Failed to delete user");
    }
};

const changePassword = async (uuid: string, changePassword: IUserChangePassword): Promise<IUserDetail | Error> => {
    try {
        const { data } = await Api.put(`${environment.apiUrl}/users/${uuid}/change-password`, changePassword);
        if (data) {
            return data;
        }
        return new Error("Failed to change password");
    } catch (error) {
        return new Error("Failed to change password");
    }
};

export const UserService = { getAll, getByUuid, create, update, deleteByUuid, changePassword };
