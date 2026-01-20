import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const linkStyle = (path: string) => ({
        display: 'block',
        padding: '12px 20px',
        color: isActive(path) ? '#dc3545' : '#333',
        backgroundColor: isActive(path) ? '#f8f9fa' : 'transparent',
        textDecoration: 'none',
        borderLeft: isActive(path) ? '3px solid #dc3545' : '3px solid transparent',
        marginBottom: '5px',
        fontWeight: isActive(path) ? 'bold' as const : 'normal' as const
    });

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        logout();
    };

    return (
        <div className="user-sidebar">
            <div 
                className="sidebar-header"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                style={{ 
                    backgroundColor: '#003366', 
                    color: 'white', 
                    padding: '15px 20px', 
                    fontWeight: 'bold', 
                    fontSize: '18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <span>My Account</span>
                <span className="mobile-toggle-icon" style={{ fontSize: '12px' }}>
                    {isMobileOpen ? '▲' : '▼'}
                </span>
            </div>
            <div className={`sidebar-menu ${isMobileOpen ? 'open' : ''}`} style={{ padding: '10px 0' }}>
                <Link to="/profile" style={linkStyle('/profile')}>My Profile</Link>
                <Link to="/profile/password" style={linkStyle('/profile/password')}>Change Password</Link>
                <Link to="/profile/free-ads" style={linkStyle('/profile/free-ads')}>Free Ads</Link>
                <Link to="/profile/upgraded-ads" style={linkStyle('/profile/upgraded-ads')}>Upgraded Ads</Link>
                <Link to="/profile/activity" style={linkStyle('/profile/activity')}>Ads Activity</Link>
                <Link to="/wishlist" style={linkStyle('/wishlist')}>My Wishlist</Link>
                <Link to="/profile/followers" style={linkStyle('/profile/followers')}>My Followers</Link>
                <Link to="/profile/following" style={linkStyle('/profile/following')}>My Following</Link>
                <Link to="/profile/payments" style={linkStyle('/profile/payments')}>Payments</Link>
                <a href="#" onClick={handleLogout} style={{ ...linkStyle(''), color: '#333' }}>Logout</a>
            </div>
        </div>
    );
};

export default UserSidebar;
