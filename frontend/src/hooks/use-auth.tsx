import { createContext, useContext, useState } from "react";
import { setUserHeader } from "../api/client";
import type { User } from "@/api/case/type";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("user");
        if (saved) {
            const userData = JSON.parse(saved);
            setUserHeader(userData.id);
            return userData;
        }
        return null;
    });

    const login = (u: User) => {
        setUser(u);
        setUserHeader(u.id);
        localStorage.setItem("user", JSON.stringify(u));
    };

    const logout = () => {
        setUser(null);
        setUserHeader(''); 
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
