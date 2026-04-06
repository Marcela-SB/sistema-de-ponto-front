import type { AuthResponse, LoginCredentials } from "../types/perfils";
import api from "./axios";

const url = "/users";

export const userService = {

    login: async (credentials : LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post(`/auth/login`, credentials);
        return response.data;
    },

    delete: async (userExternalId: string): Promise<void> => {
        await api.delete(`${url}/${userExternalId}`);
    },
    
}