import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import api from '../api/axios';
import { usePageLoader } from '../components/UiFeedbackProvider';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    country?: string;
}

const Followers = () => {
    const [followers, setFollowers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
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
        const fetchFollowers = async () => {
            try {
                const res = await api.get('/user/followers');
                setFollowers(res.data);
            } catch (err: any) {
                setError('Failed to fetch followers');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>My Followers</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && followers.length === 0 && (
                    <p>You have no followers yet.</p>
                )}

                {followers.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {followers.map(user => (
                            <div key={user.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#666' }}>
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 5px' }}>{user.first_name} {user.last_name}</h4>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.country || 'Unknown Location'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Followers;
