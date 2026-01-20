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
    const selectStyle = { ...inputStyle, height: '40px' };

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
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>My Profile</h2>
                
                {message && <p style={{ color: 'green', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>{message}</p>}
                {error && <p style={{ color: 'red', padding: '10px', background: '#f8d7da', borderRadius: '4px' }}>{error}</p>}

                <form onSubmit={handleProfileUpdate}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <input 
                                type="text" 
                                placeholder="First Name"
                                value={formData.first_name} 
                                onChange={e => setFormData({...formData, first_name: e.target.value})}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Last Name"
                                value={formData.last_name} 
                                onChange={e => setFormData({...formData, last_name: e.target.value})}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email"
                                value={formData.email} 
                                readOnly
                                style={{ ...inputStyle, backgroundColor: '#e9ecef', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="Phone Number"
                                value={formData.phone} 
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                required
                                style={inputStyle}
                            />
                            <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '12px' }}>
                                Please add phone number with country code. Eg: +234 1 227 8908
                            </small>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <select 
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                                style={selectStyle}
                            >
                                <option value="">-- Country --</option>
                                <option value="Nigeria">Nigeria</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                value={formData.state}
                                onChange={e => setFormData({...formData, state: e.target.value})}
                                style={selectStyle}
                            >
                                <option value="">-- State --</option>
                                <option value="Lagos">Lagos</option>
                                <option value="Abuja">Abuja</option>
                                <option value="New York">New York</option>
                            </select>
                        </div>
                        <div>
                            <select 
                                value={formData.city}
                                onChange={e => setFormData({...formData, city: e.target.value})}
                                style={selectStyle}
                            >
                                <option value="">-- City --</option>
                                <option value="Ikeja">Ikeja</option>
                                <option value="Lekki">Lekki</option>
                                <option value="Manhattan">Manhattan</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            placeholder="Zipcode"
                            value={formData.zipcode} 
                            onChange={e => setFormData({...formData, zipcode: e.target.value})}
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <textarea 
                            placeholder="Address"
                            value={formData.address} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                        />
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
