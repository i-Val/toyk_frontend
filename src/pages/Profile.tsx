import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import { useToast, useConfirm } from '../components/UiFeedbackProvider';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        country: '',
        state: '',
        city: '',
        zipcode: '',
        address: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone: user.phone || '',
                email: user.email || '',
                country: user.country || '',
                state: user.state || '',
                city: user.city || '',
                zipcode: user.zipcode || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const res = await api.put('/profile', formData);
            setUser(res.data.user);
            setMessage('Profile updated successfully');
            showToast('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
            showToast(err.response?.data?.message || 'Failed to update profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box' as const, borderRadius: '4px', border: '1px solid #ddd' };

    const handleDeleteAccount = async () => {
        const confirmed = await confirm({
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete('/profile');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error("Failed to delete account", error);
            showToast('Failed to delete account', 'error');
        }
    };

    return (
        <div className="profile-wrapper">
            <UserSidebar />
            
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>My Profile</h2>
                
                {message && <p style={{ color: 'green', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>{message}</p>}
                {error && <p style={{ color: 'red', padding: '10px', background: '#f8d7da', borderRadius: '4px' }}>{error}</p>}

                <form onSubmit={handleProfileUpdate}>
                    <div className="responsive-grid-2">
                        <div>
                            <input 
                                type="text" 
                                placeholder="First Name"
                                value={formData.first_name} 
                                onChange={e => setFormData({...formData, first_name: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Last Name"
                                value={formData.last_name} 
                                onChange={e => setFormData({...formData, last_name: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div className="responsive-grid-2">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Phone"
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email"
                                value={formData.email} 
                                readOnly
                                style={{ ...inputStyle, background: '#f9f9f9' }}
                            />
                        </div>
                    </div>

                    <div className="responsive-grid-3">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Country"
                                value={formData.country} 
                                onChange={e => setFormData({...formData, country: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="State"
                                value={formData.state} 
                                onChange={e => setFormData({...formData, state: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="City"
                                value={formData.city} 
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div className="responsive-grid-2">
                        <div>
                            <input 
                                type="text" 
                                placeholder="Zipcode"
                                value={formData.zipcode} 
                                onChange={e => setFormData({...formData, zipcode: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Address"
                                value={formData.address} 
                                onChange={e => setFormData({...formData, address: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button 
                            type="button" 
                            onClick={handleDeleteAccount}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Delete Account
                        </button>
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#0056b3', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '25px', 
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {loading ? 'Updating...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
