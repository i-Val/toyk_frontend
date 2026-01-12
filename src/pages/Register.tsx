import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', formData);
            if (response.data && response.data.access_token) {
                login(response.data.access_token, response.data.user);
                navigate('/');
            } else {
                 setError('Registration successful but no token received');
            }
        } catch (err: any) {
            console.error('Registration Error:', err);
            const errorMessage = err.response?.data?.message || 'Registration failed';
            const validationErrors = err.response?.data?.errors;
            
            if (validationErrors) {
                // If there are validation errors, you might want to display them specifically
                // For now, we'll append the first validation error to the message
                const firstError = Object.values(validationErrors)[0];
                setError(`${errorMessage}: ${firstError}`);
            } else {
                setError(errorMessage);
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>First Name:</label>
                    <input type="text" name="first_name" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Last Name:</label>
                    <input type="text" name="last_name" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Phone:</label>
                    <input type="text" name="phone" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input type="email" name="email" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label>
                    <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Confirm Password:</label>
                    <input type="password" name="password_confirmation" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;
