import { useState, useEffect } from 'react';
import api from '../api/axios';
import UserSidebar from '../components/UserSidebar';
import { Link } from 'react-router-dom';

interface Product {
    id: number;
    title: string;
    total_views: number;
    created_at: string;
}

const AdsActivity = () => {
    const [ads, setAds] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await api.get('/my-products');
                setAds(res.data);
            } catch (err: any) {
                setError('Failed to fetch activity');
            } finally {
                setLoading(false);
            }
        };

        fetchAds();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Ads Activity</h2>
                
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && ads.length === 0 && <p>No activity found.</p>}

                {ads.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Ad Title</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Date Posted</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Total Views</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ads.map(ad => (
                                <tr key={ad.id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{ad.title}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(ad.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{ad.total_views}</td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <Link to={`/products/${ad.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdsActivity;
