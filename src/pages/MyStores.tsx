import { useState, useEffect } from 'react';
import api from '../api/axios';
import UserSidebar from '../components/UserSidebar';
import { Link } from 'react-router-dom';
import { useToast, usePageLoader } from '../components/UiFeedbackProvider';

const MyStores = () => {
    const [stores, setStores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();

    const fetchStores = async () => {
        try {
            const res = await api.get('/my-stores');
            setStores(res.data);
        } catch (err) {
            showToast('Failed to fetch stores', 'error');
        } finally {
            setLoading(false);
            stopLoading();
        }
    };

    useEffect(() => {
        startLoading();
        fetchStores();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this store?')) return;
        startLoading();
        try {
            await api.delete(`/stores/${id}`);
            setStores(stores.filter(s => s.id !== id));
            showToast('Store deleted successfully');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to delete store', 'error');
        } finally {
            stopLoading();
        }
    };

    return (
        <div className="profile-wrapper">
            <UserSidebar />
            <div style={{ flex: 1, padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>My Stores</h2>
                    <Link to="/profile/create-store" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                        Create New Store
                    </Link>
                </div>
                
                {loading ? (
                    <div>Loading...</div>
                ) : stores.length === 0 ? (
                    <p>You haven't created any stores yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {stores.map(store => (
                            <div key={store.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{store.name}</h3>
                                    <p style={{ margin: 0, color: '#666', fontSize: '0.9em' }}>/{store.slug}</p>
                                    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '12px', background: store.status === 'active' ? '#e6fffa' : '#fff5f5', color: store.status === 'active' ? '#047857' : '#c53030', fontSize: '0.8em', marginTop: '5px' }}>
                                        {store.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link to={`/profile/edit-store/${store.id}`} style={{ padding: '5px 10px', background: '#f0f0f0', color: '#333', textDecoration: 'none', borderRadius: '4px' }}>
                                        Edit
                                    </Link>
                                    <button onClick={() => handleDelete(store.id)} style={{ padding: '5px 10px', background: '#fff5f5', color: '#c53030', border: '1px solid #c53030', borderRadius: '4px', cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyStores;
