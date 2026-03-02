import type { Intern } from "../types/perfils";
import api from "./axios";

const url = "/interns";

export const internService = {
    getMyInterns: async (supervisorExternalId:string): Promise<Intern[]> => {
        const responses = await api.get(`${url}/supervisor/${supervisorExternalId}`);
        return responses.data;
    }
}