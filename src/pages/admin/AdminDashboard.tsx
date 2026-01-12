import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users_count: 0,
        products_count: 0,
        categories_count: 0,
        plans_count: 0,
        reports_count: 0,
        messages_count: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' }}>
                <Link to="/admin/users" style={cardStyle}>
                    <h3>Users</h3>
                    <p style={statStyle}>{stats.users_count}</p>
                    <p>Manage Users</p>
                </Link>
                <Link to="/admin/products" style={cardStyle}>
                    <h3>Products</h3>
                    <p style={statStyle}>{stats.products_count}</p>
                    <p>Manage Products</p>
                </Link>
                <Link to="/admin/categories" style={cardStyle}>
                    <h3>Categories</h3>
                    <p style={statStyle}>{stats.categories_count}</p>
                    <p>Manage Categories</p>
                </Link>
                <Link to="/admin/plans" style={cardStyle}>
                    <h3>Plans</h3>
                    <p style={statStyle}>{stats.plans_count}</p>
                    <p>Manage Membership Plans</p>
                </Link>
                <Link to="/admin/pages" style={cardStyle}>
                    <h3>Pages</h3>
                    <p>Manage Static Pages</p>
                </Link>
                <Link to="/admin/contacts" style={cardStyle}>
                    <h3>Messages</h3>
                    <p style={statStyle}>{stats.messages_count}</p>
                    <p>View Contact Messages</p>
                </Link>
                <Link to="/admin/reports" style={cardStyle}>
                    <h3>Reports</h3>
                    <p style={statStyle}>{stats.reports_count}</p>
                    <p>View Reported Ads</p>
                </Link>
                <Link to="/admin/news" style={cardStyle}>
                    <h3>News</h3>
                    <p>Manage Blog Posts</p>
                </Link>
            </div>
        </div>
    );
};

const cardStyle = {
    display: 'block',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#333',
    background: '#f8f9fa',
    textAlign: 'center' as const,
    transition: 'transform 0.2s',
    cursor: 'pointer'
};

const statStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#007bff',
    margin: '10px 0'
};

export default AdminDashboard;