import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useToast, useConfirm, usePageLoader } from '../components/UiFeedbackProvider';

interface Product {
    id: number;
    title: string;
    price: number;
    category: {
        id: number;
        name: string;
    };
    images: {
        id: number;
        url: string;
    }[];
}

interface WishlistItem {
    id: number;
    product: Product;
}

const Wishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
        const fetchWishlist = async () => {
            try {
                const res = await api.get('/wishlists');
                setWishlist(res.data);
            } catch (err: any) {
                setError('Failed to fetch wishlist');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (productId: number) => {
        const confirmed = await confirm({
            title: 'Remove Item',
            message: 'Remove from wishlist?',
            confirmText: 'Remove',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;
        try {
            await api.post(`/wishlists/toggle/${productId}`);
            setWishlist(prev => prev.filter(item => item.product.id !== productId));
            showToast('Item removed from wishlist');
        } catch (err) {
            console.error(err);
            showToast('Failed to remove item', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>My Wishlist</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && wishlist.length === 0 && (
                    <p>Your wishlist is empty.</p>
                )}

                {wishlist.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {wishlist.map(item => (
                            <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                                <div style={{ height: '150px', backgroundColor: '#f4f4f4' }}>
                                    {item.product.images && item.product.images.length > 0 ? (
                                        <img 
                                            src={item.product.images[0].url} 
                                            alt={item.product.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <h3 style={{ margin: '0 0 5px', fontSize: '16px' }}>
                                        <Link to={`/products/${item.product.id}`} style={{ color: '#333', textDecoration: 'none' }}>
                                            {item.product.title}
                                        </Link>
                                    </h3>
                                    <p style={{ color: '#dc3545', fontWeight: 'bold', margin: '0 0 10px' }}>
                                        ${item.product.price}
                                    </p>
                                    <button 
                                        onClick={() => handleRemove(item.product.id)}
                                        style={{ 
                                            width: '100%', 
                                            padding: '8px', 
                                            backgroundColor: '#f8f9fa', 
                                            border: '1px solid #ddd', 
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#dc3545'
                                        }}
                                    >
                                        Remove
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

export default Wishlist;
