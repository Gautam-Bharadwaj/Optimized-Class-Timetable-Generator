import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/types';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: Role[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirect to dashboard if user doesn't have permission
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

export default RoleGuard;
