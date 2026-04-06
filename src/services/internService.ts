import type { Intern, UserRole } from "../types/perfils";
import api from "./axios";

const url = "/interns";

export interface UserCreateRequest {
    name: string;
    cpf: string;
    email: string;
    role: UserRole;
    departmentExternalId: string | null;
}

export interface InternCreateRequest {
    user: UserCreateRequest;
    enrollmentNumber: string;
    supervisorExternalId: string;
}

export const internService = {
    getMyInterns: async (supervisorExternalId:string): Promise<Intern[]> => {
        const responses = await api.get(`${url}/supervisor/${supervisorExternalId}`);
        return responses.data;
    },

    create: async (intern: InternCreateRequest): Promise<Intern> => {
        const response = await api.post(`${url}`, 
            intern
        );
        return response.data;
    },

    update: async (internExternalId: string, intern: InternCreateRequest): Promise<Intern> => {
        const response = await api.put(`${url}/${internExternalId}`, 
            intern
        );
        return response.data;
    },
}