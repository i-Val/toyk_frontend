import { useState } from 'react';
import api from '../api/axios';
import UserSidebar from '../components/UserSidebar';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        if (formData.new_password !== formData.new_password_confirmation) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await api.put('/profile/password', formData);
            setMessage('Password changed successfully');
            setFormData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box' as const, borderRadius: '4px', border: '1px solid #ddd', marginBottom: '20px' };

    return (
        <div className="profile-wrapper">
            <UserSidebar />
            
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Change Password</h2>
                
                {message && <p style={{ color: 'green', padding: '10px', background: '#d4edda', borderRadius: '4px' }}>{message}</p>}
                {error && <p style={{ color: 'red', padding: '10px', background: '#f8d7da', borderRadius: '4px' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Current Password</label>
                        <input 
                            type="password" 
                            value={formData.current_password} 
                            onChange={e => setFormData({...formData, current_password: e.target.value})}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>New Password</label>
                        <input 
                            type="password" 
                            value={formData.new_password} 
                            onChange={e => setFormData({...formData, new_password: e.target.value})}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Confirm New Password</label>
                        <input 
                            type="password" 
                            value={formData.new_password_confirmation} 
                            onChange={e => setFormData({...formData, new_password_confirmation: e.target.value})}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '10px 20px', 
                            backgroundColor: '#0056b3', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        {loading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
