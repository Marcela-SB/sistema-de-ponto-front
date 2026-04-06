import type { TimeRecord } from "../types/registers";
import api from "./axios";

const url = "/time-records";

export const recordService = {

    getAvaliableYears: async (): Promise<number[]> => {
        const response = await api.get(`${url}/available-years`);
        return response.data.years || [];
    },

    getMyToday: async (externalId: string): Promise<TimeRecord | null> => {
        const response = await api.get(`${url}/intern/${externalId}/today`);

        if (response.status === 204 || !response.data) {
            return null;
        }

        return response.data;
    },

    punchClock: async (externalId: string, obs?: string): Promise<TimeRecord> => {
        const body = obs ? { text: obs } : {};
        const response = await api.post(`${url}/intern/${externalId}`, body);
        return response.data;
    }
}