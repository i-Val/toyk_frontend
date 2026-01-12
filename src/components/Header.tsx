import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/products?search=${searchTerm}`);
    };

    const is_admin = user?.is_admin;

    return (
        <header style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '15px 0' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
                {/* Logo */}
                <Link to="/" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#0056b3', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <img src="/logo.png" alt="Toyk" style={{ height: '40px', marginRight: '10px' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                    Toyk Market
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, maxWidth: '500px', margin: '0 20px' }}>
                    <input 
                        type="text" 
                        placeholder="Search for products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '4px 0 0 4px', border: '1px solid #ccc', borderRight: 'none' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
                        Search
                    </button>
                </form>

                {/* Navigation */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <Link to="/products" style={{ color: '#333', textDecoration: 'none' }}>Browse</Link>
                    <Link to="/plans" style={{ color: '#333', textDecoration: 'none' }}>Plans</Link>
                    <Link to="/contact" style={{ color: '#333', textDecoration: 'none' }}>Contact</Link>
                    <Link to="/news" style={{ color: '#333', textDecoration: 'none' }}>News</Link>
                    
                    {user ? (
                        <>
                            <Link to="/wishlist" style={{ color: '#333', textDecoration: 'none' }}>Wishlist</Link>
                            <div style={{ position: 'relative', display: 'inline-block' }} className="dropdown">
                                <span 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    style={{ cursor: 'pointer', fontWeight: 'bold', color: '#0056b3', userSelect: 'none' }}
                                >
                                    {user.first_name} ▼
                                </span>
                                {isDropdownOpen && (
                                    <div className="dropdown-content" style={{
                                        position: 'absolute',
                                        right: 0,
                                        backgroundColor: '#f9f9f9',
                                        minWidth: '160px',
                                        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                        zIndex: 1,
                                        borderRadius: '4px',
                                        padding: '10px 0'
                                    }}>
                                        <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Dashboard</Link>
                                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Profile</Link>
                                        <Link to="/products/create" onClick={() => setIsDropdownOpen(false)} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Sell Item</Link>
                                        {is_admin && <Link to="/admin" onClick={() => setIsDropdownOpen(false)} style={{ color: 'red', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Admin Panel</Link>}
                                        <button onClick={() => { setIsDropdownOpen(false); logout(); }} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '12px 16px', cursor: 'pointer', color: 'black' }}>Logout</button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: '#333', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" style={{ padding: '8px 15px', background: '#28a745', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;