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
        <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
            <div style={{ 
                background: '#0056b3', 
                borderRadius: '50px', 
                padding: '30px 50px', 
                display: 'flex', 
                flexWrap: 'wrap',
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '20px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ 
                    fontSize: '2rem', 
                    fontWeight: '700', 
                    color: 'white',
                    margin: 0,
                    whiteSpace: 'nowrap'
                }}>
                    Join our newsletter
                </h2>
                
                <form onSubmit={subscribe} style={{ display: 'flex', gap: '15px', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Enter Your E-mail" 
                        required 
                        style={{ 
                            padding: '15px 20px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontSize: '1rem',
                            flex: '1 1 250px',
                            maxWidth: '450px',
                            outline: 'none'
                        }}
                    />
                    <button 
                        type="submit" 
                        style={{ 
                            padding: '15px 40px', 
                            background: '#dc3545', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer', 
                            fontSize: '1rem', 
                            fontWeight: '600',
                            borderRadius: '6px',
                            whiteSpace: 'nowrap',
                            transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#c82333'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#dc3545'}
                    >
                        Subscribe
                    </button>
                </form>
            </div>
            {message && (
                <div style={{ 
                    marginTop: '20px', 
                    textAlign: 'center',
                    padding: '10px', 
                    color: message.includes('success') ? 'green' : 'red'
                }}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default Newsletter;