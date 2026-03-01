// --- Tipos Base e Enums ---
export const ROLES = {
    ADMIN: 'Administrador',
    SUPERVISOR: 'Supervisor',
    INTERN: 'Bolsista'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// --- Entidades ---

export interface User {
    externalId: string;
    name: string;
    cpf: string;
    email: string;
    role: UserRole;
    department: string;
}

export interface Intern {
    user: User;
    externalId: string;
    enrollmentNumber: string;
    supervisorName: string;
    supervisorExternalId: string;
}


export interface AuthResponse {
    externalId: string;
    internExternalId?: string | null;
    name: string;
    role: UserRole;
    token: string;
    expiresIn: number;
}

export interface LoginCredentials {
    cpf: string;
    password: string;
}