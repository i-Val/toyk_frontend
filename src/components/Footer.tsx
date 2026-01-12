import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';

const Footer = () => {
    const [email, setEmail] = useState('');
    
    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/newsletter/subscribe', { email });
            alert('Subscribed to newsletter!');
            setEmail('');
        } catch (error) {
            console.error(error);
            alert('Failed to subscribe.');
        }
    };

    return (
        <footer style={{ background: '#333', color: 'white', padding: '40px 20px', marginTop: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                    <h3>Toyk Market</h3>
                    <p>Your number one source for all things.</p>
                    <form onSubmit={handleSubscribe} style={{ marginTop: '10px' }}>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '8px', borderRadius: '4px 0 0 4px', border: 'none' }}
                        />
                        <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer' }}>
                            Subscribe
                        </button>
                    </form>
                </div>
                <div>
                    <h4>Quick Links</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li><Link to="/pages/about-us" style={{ color: '#ccc', textDecoration: 'none' }}>About Us</Link></li>
                        <li><Link to="/pages/terms-and-conditions" style={{ color: '#ccc', textDecoration: 'none' }}>Terms & Conditions</Link></li>
                        <li><Link to="/pages/privacy-policy" style={{ color: '#ccc', textDecoration: 'none' }}>Privacy Policy</Link></li>
                        <li><Link to="/contact" style={{ color: '#ccc', textDecoration: 'none' }}>Contact Us</Link></li>
                        <li><Link to="/plans" style={{ color: '#ccc', textDecoration: 'none' }}>Membership Plans</Link></li>
                    </ul>
                </div>
                <div>
                    <h4>Contact</h4>
                    <p>Email: info@toykmarket.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #555', paddingTop: '20px' }}>
                &copy; {new Date().getFullYear()} Toyk Market. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;