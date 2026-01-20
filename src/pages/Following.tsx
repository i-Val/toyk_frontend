import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import api from '../api/axios';
import { useToast, useConfirm, usePageLoader } from '../components/UiFeedbackProvider';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    country?: string;
}

const Following = () => {
    const [following, setFollowing] = useState<User[]>([]);
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
        const fetchFollowing = async () => {
            try {
                const res = await api.get('/user/following');
                setFollowing(res.data);
            } catch (err: any) {
                setError('Failed to fetch following');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowing();
    }, []);

    const handleUnfollow = async (id: number) => {
        const confirmed = await confirm({
            title: 'Unfollow User',
            message: 'Are you sure you want to unfollow?',
            confirmText: 'Unfollow',
            cancelText: 'Cancel',
        });
        if (!confirmed) return;
        try {
            await api.post(`/user/unfollow/${id}`);
            setFollowing(following.filter(user => user.id !== id));
            showToast('Unfollowed successfully');
        } catch (err) {
            showToast('Failed to unfollow', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>My Following</h2>
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && following.length === 0 && (
                    <p>You are not following anyone yet.</p>
                )}

                {following.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {following.map(user => (
                            <div key={user.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#666' }}>
                                    {user.first_name[0]}{user.last_name[0]}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px' }}>{user.first_name} {user.last_name}</h4>
                                    <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{user.country || 'Unknown Location'}</p>
                                    <button 
                                        onClick={() => handleUnfollow(user.id)}
                                        style={{ 
                                            marginTop: '10px',
                                            padding: '5px 10px', 
                                            backgroundColor: '#fff', 
                                            border: '1px solid #dc3545', 
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            color: '#dc3545',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Unfollow
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

export default Following;
