import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "Admin" | "Authority" | "Energy" | "Citizen";

interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("dersdp_user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (role: UserRole) => {
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${role} User`,
            role: role,
            email: `${role.toLowerCase()}@dersdp.gov.in`,
        };
        setUser(mockUser);
        localStorage.setItem("dersdp_user", JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("dersdp_user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
