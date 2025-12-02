import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleGuard = ({ children, allowedRoles }) => {
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
