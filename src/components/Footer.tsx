import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import { useToast } from './UiFeedbackProvider';

const Footer = () => {
    const [email, setEmail] = useState('');
    const { showToast } = useToast();
    
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/newsletter/subscribe', { email });
            showToast('Subscribed to newsletter!');
            setEmail('');
        } catch (error) {
            console.error(error);
            showToast('Failed to subscribe.', 'error');
        }
    };

    return (
        <footer style={{ background: '#1a1a1a', color: '#e0e0e0', padding: '60px 20px', marginTop: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '40px' }}>
                <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                    <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '15px', letterSpacing: '0.5px' }}>Toyk Market</h3>
                    <p style={{ marginBottom: '25px', lineHeight: '1.6', color: '#a0a0a0' }}>
                        Join our community! Subscribe to our newsletter to get the latest updates, news, and special offers delivered directly to your inbox.
                    </p>
                    <form onSubmit={handleSubscribe} style={{ display: 'flex', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <input 
                            type="email" 
                            placeholder="Your email address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                flex: 1,
                                padding: '14px 18px', 
                                borderRadius: '6px 0 0 6px', 
                                border: '1px solid #333',
                                borderRight: 'none',
                                outline: 'none',
                                fontSize: '0.95rem',
                                background: '#2a2a2a',
                                color: '#fff'
                            }}
                        />
                        <button 
                            type="submit" 
                            style={{ 
                                padding: '14px 24px', 
                                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '0 6px 6px 0', 
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px', position: 'relative', paddingBottom: '10px' }}>
                        Quick Links
                        <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: '#007bff' }}></span>
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <li><Link to="/about-us" style={{ color: '#b0b0b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#b0b0b0'}>About Us</Link></li>
                        <li><Link to="/terms" style={{ color: '#b0b0b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#b0b0b0'}>Terms & Conditions</Link></li>
                        <li><Link to="/privacy-policy" style={{ color: '#b0b0b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#b0b0b0'}>Privacy Policy</Link></li>
                        <li><Link to="/contact" style={{ color: '#b0b0b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#b0b0b0'}>Contact Us</Link></li>
                        <li><Link to="/plans" style={{ color: '#b0b0b0', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#b0b0b0'}>Membership Plans</Link></li>
                    </ul>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '20px', position: 'relative', paddingBottom: '10px' }}>
                        Contact
                        <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '2px', background: '#007bff' }}></span>
                    </h4>
                    <p style={{ color: '#b0b0b0', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#007bff' }}>✉</span> info@toykmarket.com
                    </p>
                    <p style={{ color: '#b0b0b0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#007bff' }}>📞</span> +123 456 7890
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid #333', paddingTop: '30px', color: '#666', fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Toyk Market. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
