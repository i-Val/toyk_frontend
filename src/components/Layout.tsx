import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import TopCategories from './TopCategories';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');
    const hideCategories = ['/login', '/register', '/admin'].some(path => location.pathname.startsWith(path));

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            {!hideCategories && <TopCategories />}
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;