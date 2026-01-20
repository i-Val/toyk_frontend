import { Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageLoader } from './UiFeedbackProvider';

const AdminRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();
    const { startLoading, stopLoading } = usePageLoader();

    useEffect(() => {
        if (loading) {
            startLoading();
        } else {
            stopLoading();
        }

        return () => {
            stopLoading();
        };
    }, [loading, startLoading, stopLoading]);

    if (loading) {
        return null;
    }

    const u = user as any;
    const isAdmin =
        !!(u &&
        (u.is_admin === true ||
         u.is_admin === 1 ||
         (typeof u.is_admin === 'string' && u.is_admin === '1') ||
         u.role === 'admin' ||
         u.isAdmin === true));

    if (!user || !isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;
