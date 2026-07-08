import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const loggedUserID = useSelector((state) => state.userInfo.loggedUserID);
    const userRole = useSelector((state) => state.userInfo.userRole);

    // 1. Unauthenticated users go back to login
    if (!loggedUserID) {
        return <Navigate to="/auth/login" replace />;
    }

    // 2. Strict Role Verification
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Redirect unauthorized users to their correct dashboards based on actual role
        return userRole === 'admin' 
            ? <Navigate to="/admin/home" replace /> 
            : <Navigate to="/rep/home" replace />;
    }

    // 3. Authorized -> Render children routes
    return <Outlet />;
};

export default ProtectedRoute;