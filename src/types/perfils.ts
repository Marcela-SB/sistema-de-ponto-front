// --- Tipos Base e Enums ---
export const ROLES = {
    ADMIN: 'ADMIN',
    SUPERVISOR: 'SUPERVISOR',
    INTERN: 'INTERN'
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.SUPERVISOR]: 'Supervisor',
    [ROLES.INTERN]: 'Bolsista'
};

export type UserRole = keyof typeof ROLES;

// --- Entidades ---

export interface User {
    externalId: string;
    name: string;
    cpf: string;
    email: string;
    role: UserRole;
    department: string;
    active: boolean;
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