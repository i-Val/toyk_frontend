import { useState, useEffect } from 'react';
import api from '../api/axios';
import UserSidebar from '../components/UserSidebar';
import { Link } from 'react-router-dom';
import { useToast, useConfirm, usePageLoader } from '../components/UiFeedbackProvider';

interface Product {
    id: number;
    title: string;
    price: number;
    currency_code: string;
    status: string;
    ad_type: string;
    images: { image: string }[];
}

const FreeAds = () => {
    const [ads, setAds] = useState<Product[]>([]);
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
        const fetchAds = async () => {
            try {
                const res = await api.get('/my-products?ad_type=free');
                setAds(res.data);
            } catch (err: any) {
                setError('Failed to fetch ads');
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    const handleUpgrade = async (id: number) => {
        const confirmed = await confirm({
            title: 'Upgrade Ad',
            message: 'Are you sure you want to upgrade this ad?',
            confirmText: 'Upgrade',
            cancelText: 'Cancel'
        });
        if (!confirmed) return;
        try {
            await api.post(`/products/${id}/upgrade`);
            setAds(prev => prev.filter(ad => ad.id !== id));
            showToast('Ad upgraded successfully!');
        } catch (err) {
            showToast('Failed to upgrade ad', 'error');
        }
    };

    return (
        <div className="profile-wrapper">
            <UserSidebar />
            
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Free Ads</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && ads.length === 0 && <p>You have no free ads.</p>}

                <div style={{ display: 'grid', gap: '15px' }}>
                    {ads.map(ad => (
                        <div key={ad.id} className="product-list-item">
                            <img 
                                src={ad.images?.[0]?.image ? `http://localhost:8000/storage/${ad.images[0].image}` : 'https://via.placeholder.com/100'} 
                                alt={ad.title}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: '0 0 5px 0' }}>{ad.title}</h3>
                                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>{ad.currency_code} {ad.price}</p>
                                <p style={{ margin: '0 0 10px 0', color: '#666' }}>Status: {ad.status}</p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Link to={`/products/${ad.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>View</Link>
                                    <Link to={`/edit-product/${ad.id}`} style={{ textDecoration: 'none', color: '#28a745' }}>Edit</Link>
                                    <button 
                                        onClick={() => handleUpgrade(ad.id)}
                                        style={{ border: 'none', background: 'none', color: '#e0a800', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                                    >
                                        Upgrade Ad
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FreeAds;
