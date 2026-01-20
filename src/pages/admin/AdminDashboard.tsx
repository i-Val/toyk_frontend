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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase">Total Visits</div>
                    <div className="text-xs text-gray-400 mt-1">All time</div>
                    <div className="text-2xl font-bold text-blue-600 mt-3">{loading ? '...' : stats.reports_count}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase">Total Users</div>
                    <div className="text-xs text-gray-400 mt-1">All time</div>
                    <div className="text-2xl font-bold text-blue-600 mt-3">{loading ? '...' : stats.users_count}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase">Total Ads</div>
                    <div className="text-xs text-gray-400 mt-1">All time</div>
                    <div className="text-2xl font-bold text-blue-600 mt-3">{loading ? '...' : stats.products_count}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-xs text-gray-500 uppercase">Total Payments</div>
                    <div className="text-xs text-gray-400 mt-1">All time</div>
                    <div className="text-2xl font-bold text-blue-600 mt-3">{loading ? '...' : stats.plans_count}</div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
                <h2 className="m-0 mb-2.5 text-lg text-center">Daily Posts Report</h2>
                <div className="border border-gray-300 h-64 flex items-center justify-center text-gray-400 text-sm">
                    Chart placeholder
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Link to="/admin/users" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Users</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.users_count}</p>
                    <p>Manage Users</p>
                </Link>
                <Link to="/admin/products" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Products</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.products_count}</p>
                    <p>Manage Products</p>
                </Link>
                <Link to="/admin/categories" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Categories</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.categories_count}</p>
                    <p>Manage Categories</p>
                </Link>
                <Link to="/admin/plans" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Plans</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.plans_count}</p>
                    <p>Manage Membership Plans</p>
                </Link>
                <Link to="/admin/pages" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Pages</h3>
                    <p>Manage Static Pages</p>
                </Link>
                <Link to="/admin/contacts" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Messages</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.messages_count}</p>
                    <p>View Contact Messages</p>
                </Link>
                <Link to="/admin/reports" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>Reports</h3>
                    <p className="text-2xl font-bold text-blue-600 my-2.5">{stats.reports_count}</p>
                    <p>View Reported Ads</p>
                </Link>
                <Link to="/admin/news" className="block p-5 border border-gray-300 rounded-lg no-underline text-gray-800 bg-gray-50 text-center hover:shadow-md transition-shadow">
                    <h3>News</h3>
                    <p>Manage Blog Posts</p>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
