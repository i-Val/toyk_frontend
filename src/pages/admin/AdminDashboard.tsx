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

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Dashboard</h1>
                <span style={{ fontSize: '0.85rem', color: '#777' }}>Admin / Dashboard</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '30px' }}>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Total Visits</div>
                    <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>All time</div>
                    <div style={summaryValueStyle}>{loading ? '...' : stats.reports_count}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Total Users</div>
                    <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>All time</div>
                    <div style={summaryValueStyle}>{loading ? '...' : stats.users_count}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Total Ads</div>
                    <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>All time</div>
                    <div style={summaryValueStyle}>{loading ? '...' : stats.products_count}</div>
                </div>
                <div style={summaryCardStyle}>
                    <div style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Total Payments</div>
                    <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '4px' }}>All time</div>
                    <div style={summaryValueStyle}>{loading ? '...' : stats.plans_count}</div>
                </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e6ea', borderRadius: '6px', padding: '16px', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, marginBottom: '10px', fontSize: '1.1rem', textAlign: 'center' }}>Daily Posts Report</h2>
                <div style={{ border: '1px solid #ddd', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.9rem' }}>
                    Chart placeholder
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
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

const summaryCardStyle = {
    background: '#fff',
    border: '1px solid #e2e6ea',
    borderRadius: '6px',
    padding: '14px 16px',
};

const summaryValueStyle = {
    fontSize: '1.6rem',
    fontWeight: 'bold',
    color: '#007bff',
    marginTop: '12px',
} as const;

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
