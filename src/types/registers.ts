// --- Tipos Base e Enums ---
export type ObservationType = 'INTERN' | 'SUPERVISOR';

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