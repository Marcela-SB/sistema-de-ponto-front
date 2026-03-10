// --- Tipos Base e Enums ---
export const OBS_TYPE = {
    SUPERVISOR: 'SUPERVISOR',
    INTERN: 'INTERN'
} as const;

export const OBS_LABELS = {
    [OBS_TYPE.SUPERVISOR]: 'Supervisor',
    [OBS_TYPE.INTERN]: 'Bolsista'
};

export type ObservationType = typeof OBS_TYPE[keyof typeof OBS_TYPE];
// --- Entidades ---

export interface Department {
    externalId: string;
    name: string;
}

export interface Observation {
    externalId: string;
    timeRecordExternalId: string;
    type: ObservationType;
    text: string;
    lastUpdate: string;
}

export interface TimeRecord {
    externalId: string;
    internExternalId: string;
    recordDate: string;
    clockIn: string;
    clockOut: string;
    totalHours: string;
    internObservation: Observation | null;
    supervisorObservation: Observation | null;
}


// ------------


export const createEmptyObservation = (timeRecordId: string, type: ObservationType): Observation => ({
    externalId: '',
    timeRecordExternalId: timeRecordId,
    type: type,
    text: '',
    lastUpdate: ''
});