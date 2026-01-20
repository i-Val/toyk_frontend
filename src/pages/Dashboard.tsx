import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useToast, useConfirm, usePageLoader } from '../components/UiFeedbackProvider';

const Dashboard = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { confirm } = useConfirm();
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

    useEffect(() => {
        fetchMyProducts();
    }, []);

    const fetchMyProducts = async () => {
        try {
            const res = await api.get('/my-products');
            setProducts(res.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product?',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Product deleted successfully');
        } catch (error) {
            console.error("Failed to delete product", error);
            showToast('Failed to delete product', 'error');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Dashboard</h1>
            
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '5px', marginBottom: '30px' }}>
                <h2>Welcome, {user?.first_name} {user?.last_name}!</h2>
                <p>Email: {user?.email}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <Link to="/products/create" style={{ padding: '10px 20px', background: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                        Post New Ad
                    </Link>
                    <Link to="/wishlist" style={{ padding: '10px 20px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
                        My Wishlist
                    </Link>
                </div>
            </div>

            <h2>My Ads</h2>
            {loading ? null : products.length === 0 ? (
                <p>You haven't posted any ads yet.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {products.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '150px', background: '#eee' }}>
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={`http://localhost:8000/storage/products/300/${product.images[0].image.split('/').pop()}`} 
                                        alt={product.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2em' }}>{product.title}</h3>
                                <p style={{ color: 'green', fontWeight: 'bold' }}>${product.price}</p>
                                <p style={{ fontSize: '0.9em', color: '#666' }}>{product.category?.title}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                                    <Link to={`/products/${product.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>View</Link>
                                    <Link to={`/products/edit/${product.id}`} style={{ color: '#ffc107', textDecoration: 'none' }}>Edit</Link>
                                    <button 
                                        onClick={() => handleDelete(product.id)} 
                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
