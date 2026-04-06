import type { Department } from "../types/registers"
import api from "./axios"

const url = '/departments'

export const departmentService = {

    getAll: async ():Promise<Department[]> => {
        const responses = await api.get(`${url}`);
        return responses.data;
    }
    
}