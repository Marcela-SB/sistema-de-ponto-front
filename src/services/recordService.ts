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
    },

    getRecordsByPeriod: async (externalId: string, month: number, year: number): Promise<TimeRecord[]> => {
        const formattedMonth = month.toString().padStart(2, '0');
        const period = `${year}-${formattedMonth}`;

        const response = await api.get(`${url}/intern/${externalId}/period`, {
            params: {
                startMonth: period,
                endMonth: period
            }
        });
        return response.data || [];
    },

    getMyRecords: async (externalId: string): Promise<TimeRecord[]> => {
        const responses = await api.get(`${url}/intern/${externalId}`);
        return responses.data || [];
    }
}