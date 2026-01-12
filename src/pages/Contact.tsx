import { useState } from 'react';
import api from '../api/axios';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/contact', { name, email, subject, message });
            setStatus('Message sent successfully!');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error(error);
            setStatus('Failed to send message.');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="email" 
                    placeholder="Your Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="text" 
                    placeholder="Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <textarea 
                    placeholder="Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                    rows={5}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Send Message
                </button>
            </form>
            {status && <p style={{ marginTop: '15px', color: status.includes('success') ? 'green' : 'red' }}>{status}</p>}
        </div>
    );
};

export default Contact;