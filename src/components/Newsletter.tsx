import { useState } from 'react';
import api from '../api/axios';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const subscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/newsletter/subscribe', { email });
            setMessage('Subscribed successfully!');
            setEmail('');
        } catch (error) {
            console.error(error);
            setMessage('Failed to subscribe.');
        }
    };

    return (
        <div style={{ background: '#f4f4f4', padding: '40px 20px', textAlign: 'center', marginTop: '40px' }}>
            <h2>Join our newsletter</h2>
            <form onSubmit={subscribe} style={{ marginTop: '20px' }}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter Your E-mail" 
                    required 
                    style={{ padding: '10px', width: '300px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Subscribe
                </button>
            </form>
            {message && <p style={{ marginTop: '10px', color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
        </div>
    );
};

export default Newsletter;