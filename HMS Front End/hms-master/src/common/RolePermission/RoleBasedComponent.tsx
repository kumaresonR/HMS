import { ReactNode } from "react";
import { useRole } from "./RoleContext";

const RoleBasedComponent = ({ allowedRoles, children }: { allowedRoles: string[]; children: ReactNode }) => {
    const { role } = useRole();

    if (!role || !allowedRoles.includes(role)) {
        return null; 
    }

    return <>{children}</>;
};

export default RoleBasedComponent;
