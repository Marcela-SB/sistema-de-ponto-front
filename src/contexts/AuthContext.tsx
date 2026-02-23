import { createContext, useState, useContext, type ReactNode } from 'react';
import type { AuthResponse, LoginCredentials } from '../types/perfils';
import { userService } from '../services/userService';

interface AuthContextData {
    user: AuthResponse | null;
    signIn: (credentials: LoginCredentials) => void;
    signOut: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthResponse | null>(() => {
        const savedUser = localStorage.getItem('@App:user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    async function signIn(credentials: LoginCredentials) {
        try {
            const response = await userService.login(credentials);
            setUser(response);
            localStorage.setItem('@App:user', JSON.stringify(response));
            localStorage.setItem('@App:token', response.token);
        } catch (error) {
            setUser(null);
            localStorage.removeItem('@App:user');
        }
    }

    function signOut() {
        localStorage.removeItem('@App:user');
        localStorage.removeItem('@App:token');
        setUser(null);
    }

    return (
        // isAuthenticated é true se o user não for null
        <AuthContext.Provider value={{ user, signIn, signOut, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);