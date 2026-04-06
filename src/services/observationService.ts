import { type Observation, type ObservationType } from "../types/registers";
import api from "./axios";

const url = "/observations";

export const observationService = {

    upsertObs: async (timeRecordExternalId: string, type: ObservationType, text: string): Promise<Observation> => {
        const response = await api.post(`${url}`,{
            timeRecordExternalId,
            type,
            text
        });
        return response.data;
    },

    delete: async (externalId: string): Promise<void> => {
        await api.delete(`${url}/${externalId}`);
    }
}