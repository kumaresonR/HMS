import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import StorageService from "../../helpers/storage/storage-service";

interface RoleContextType {
    role: string | null;
    setRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        let user = StorageService.getUserDataFromSessionStorage();
        setRole(user?.role || null);
    }, []);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};