import { Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageLoader } from './UiFeedbackProvider';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
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

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
