import { useState } from 'react';
import api from '../api/axios';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Include phone in the payload
            await api.post('/contact', { name, email, phone, subject, message });
            setStatus('Message sent successfully!');
            setName('');
            setEmail('');
            setPhone('');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error(error);
            setStatus('Failed to send message.');
        }
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        color: '#333'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box' as const
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            
            {/* Left Column: Address Information */}
            <div style={{ flex: '1 1 400px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '30px', color: '#333' }}>ADDRESS</h2>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Customer service in Private:</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '1rem' }}>
                        <div>Support:Frequently Asked Questions (<a href="mailto:info@toykmarket.com" style={{ color: '#0056b3', textDecoration: 'none' }}>info@toykmarket.com</a>)</div>
                        <div>Telephone: 09039585849 (WhatsApp ONLY)</div>
                        <div>Telephone: +4553535426</div>
                        <div>E-mail: <a href="mailto:info@toykmarket.com" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>info@toykmarket.com</a></div>
                        <div>Opening hours: coming soon !!!</div>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Customer Service, Business:</h3>
                    <div style={{ color: '#555', fontSize: '1rem' }}>
                        Admanager: <a href="mailto:info@toykmarket.com" style={{ color: '#0056b3', textDecoration: 'none' }}>info@toykmarket.com</a>
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Toyk Market BUSINESS:</h3>
                    <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', margin: 0 }}>
                        Want to advertise your products on Toyk Market? Who can become customers in your store. With admanager, we show your ads when users search for products on Toyk Market and send them to your webshop.
                    </p>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>Banner advertising <span style={{ fontWeight: 'normal' }}>increases awareness of your product, business and can be targeted very precisely to reach your desired audience.</span></h3>
                    <p style={{ color: '#555', lineHeight: '1.6', fontSize: '1rem', marginBottom: '15px' }}>
                        Contact us and we will help you choose the optimal solution for your business.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#555', fontSize: '1rem' }}>
                        <div>Telephone: 09039585849. (WhatsApp ONLY)</div>
                        <div>Telephone: +4553535426</div>
                        <div>E-mail: <a href="mailto:info@toykmarket.com" style={{ color: '#0056b3', textDecoration: 'none', fontWeight: 'bold' }}>info@toykmarket.com</a></div>
                    </div>
                </div>
            </div>

            {/* Right Column: Contact Form */}
            <div style={{ flex: '1 1 500px' }}>
                <div style={{ background: '#fff', padding: '40px', boxShadow: '0 0 20px rgba(0,0,0,0.05)', borderRadius: '8px', borderTop: '4px solid #fff' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px', color: '#333' }}>CONTACT US</h2>
                    <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                        The best and fastest way to get an answer to your questions is to contact us using the form below by entering all the required fields within your credentials. We will answer you within 48 hours.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Contact Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Contact Name" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Email ID</label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type="email" 
                                        placeholder="Email Id" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        required 
                                        style={{ ...inputStyle, paddingRight: '40px' }}
                                    />
                                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#28a745', fontSize: '1.2rem' }}>
                                        ✉
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Phone</label>
                                <input 
                                    type="text" 
                                    placeholder="Phone" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    style={inputStyle}
                                />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={labelStyle}>Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="Subject" 
                                    value={subject} 
                                    onChange={(e) => setSubject(e.target.value)} 
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={labelStyle}>Comments</label>
                            <textarea 
                                placeholder="Comments" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                required 
                                rows={6}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            style={{ 
                                padding: '12px 40px', 
                                background: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '30px', 
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '500',
                                transition: 'background 0.3s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#c82333'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#dc3545'}
                        >
                            Submit
                        </button>
                    </form>

                    {status && (
                        <div style={{ marginTop: '20px', padding: '10px', borderRadius: '4px', background: status.includes('success') ? '#d4edda' : '#f8d7da', color: status.includes('success') ? '#155724' : '#721c24' }}>
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;