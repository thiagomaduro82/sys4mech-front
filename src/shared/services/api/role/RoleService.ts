import { Api } from '../axios-config';
import { environment } from "../../../environment";


interface IRoleDetail {
    uuid: string;
    name: string;
    createdAt: number;
    updatedAt: number;
};

interface IRoleDTO {
    name: string;
};

type TRoleList = {
    content: IRoleDetail[];
    totalElements: number;
    totalPages: number;
};

const getAll = async (): Promise<TRoleList | Error> => {
    try {
        const urlRelative = environment.apiUrl + `/roles`;
        const {data} = await Api.get(urlRelative);
        if (data) {
            return {
                content: data.content,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            };
        }
        return new Error("No data found");
    } catch (error) {
        console.error("Error fetching roles:", error);
        return new Error("Failed to fetch roles");
    }
};

export const RoleService = { getAll};
