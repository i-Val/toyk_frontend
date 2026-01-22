import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const [manageOpen, setManageOpen] = useState(true);
    const [cmsOpen, setCmsOpen] = useState(false);
    const [autoOpen, setAutoOpen] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const navItemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 16px',
        textDecoration: 'none',
        color: '#333',
        fontSize: '0.95rem',
        cursor: 'pointer',
    };

    const navSectionHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        cursor: 'pointer',
        color: '#333',
        fontWeight: 500,
        fontSize: '0.95rem',
    };

    const iconCircleStyle: React.CSSProperties = {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.9rem',
        background: '#fff',
    };

    const renderNavLink = (to: string, label: string, icon?: ReactNode) => (
        <Link
            to={to}
            onClick={() => setSidebarOpen(false)}
            style={{
                ...navItemStyle,
                background: isActive(to) ? '#f0f4ff' : 'transparent',
                borderLeft: isActive(to) ? '3px solid #007bff' : '3px solid transparent',
            }}
        >
            <span style={iconCircleStyle}>{icon}</span>
            <span>{label}</span>
        </Link>
    );

    return (
        <div className="admin-layout">
            <div 
                className={`admin-sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
                onClick={() => setSidebarOpen(false)}
            />
            
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#007bff' }}>
                        TM
                    </div>
                    <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0056b3' }}>TOYK MARKET</div>
                        <div style={{ fontSize: '0.75rem', color: '#777' }}>Admin Panel</div>
                    </div>
                </div>

                <nav style={{ padding: '12px 0', flex: 1, overflowY: 'auto' }}>
                    <div style={{ padding: '0 8px' }}>
                        {renderNavLink('/admin', 'Dashboard', 'D')}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <div style={navSectionHeaderStyle} onClick={() => setManageOpen(o => !o)}>
                            <span>Manage</span>
                            <span>{manageOpen ? '▾' : '▸'}</span>
                        </div>
                        {manageOpen && (
                            <div>
                                {renderNavLink('/admin/home', 'Home Page', '🏠')}
                                {renderNavLink('/admin/slides', 'Slides', '🖼')}
                                {renderNavLink('/admin/users', 'Users', '👤')}
                                {renderNavLink('/admin/products', 'Post', '📄')}
                                {renderNavLink('/admin/categories', 'Category', '🗂')}
                                {renderNavLink('/admin/transactions', 'Transaction', '$')}
                                {renderNavLink('/admin/plans', 'Plans', '📦')}
                                {renderNavLink('/admin/notify', 'Notify', '🔔')}
                                {renderNavLink('/admin/currency', 'Currency', '¤')}
                                {renderNavLink('/admin/reviews', 'Reviews', '⭐')}
                                {renderNavLink('/admin/subscribers', 'Subscribers', '✉')}
                                {renderNavLink('/admin/countries', 'Countries', '🌍')}
                                {renderNavLink('/admin/states', 'States', '🗺')}
                                {renderNavLink('/admin/cities', 'Cities', '🏙')}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <div style={navSectionHeaderStyle} onClick={() => setCmsOpen(o => !o)}>
                            <span>CMS</span>
                            <span>{cmsOpen ? '▾' : '▸'}</span>
                        </div>
                        {cmsOpen && (
                            <div>
                                {renderNavLink('/admin/pages', 'All Pages', '📄')}
                                {renderNavLink('/admin/splash', 'Splash Messages', '💬')}
                                {renderNavLink('/admin/contacts', 'Contact Us', '☎')}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '16px' }}>
                        <div style={navSectionHeaderStyle} onClick={() => setAutoOpen(o => !o)}>
                            <span>Automobiles</span>
                            <span>{autoOpen ? '▾' : '▸'}</span>
                        </div>
                        {autoOpen && (
                            <div>
                                {renderNavLink('/admin/autos/makes', 'Car Makes', '🚗')}
                                {renderNavLink('/admin/autos/models', 'Car Models', '🚘')}
                                {renderNavLink('/admin/autos/body-types', 'Body Types', '🚙')}
                            </div>
                        )}
                    </div>
                </nav>

                <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#777' }}>
                    © {new Date().getFullYear()} Toyk Market. All rights reserved.
                </div>
            </aside>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <header className="admin-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            type="button"
                            className="admin-hamburger"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </button>
                        <span style={{ fontWeight: 600 }}>Dashboard</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{user?.first_name || 'Toyk'}</span>
                        <button
                            type="button"
                            onClick={logout}
                            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <main style={{ flex: 1, padding: '20px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

