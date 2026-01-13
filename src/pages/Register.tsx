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
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-5">
            <div className="w-full max-w-[500px] bg-white p-10 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <h2 className="text-center text-[#333] mb-8 text-[2rem]">Create Account</h2>
                {error && <div className="bg-[#ffebee] text-[#c62828] p-2.5 rounded mb-5 text-center">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block mb-2 text-[#555] font-medium">First Name</label>
                            <input type="text" name="first_name" onChange={handleChange} required placeholder="First Name" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                        </div>
                        <div>
                            <label className="block mb-2 text-[#555] font-medium">Last Name</label>
                            <input type="text" name="last_name" onChange={handleChange} required placeholder="Last Name" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-[#555] font-medium">Phone Number</label>
                        <input type="text" name="phone" onChange={handleChange} required placeholder="Enter phone number" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-[#555] font-medium">Email Address</label>
                        <input type="email" name="email" onChange={handleChange} required placeholder="Enter email address" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                    </div>

                    <div className="mb-5">
                        <label className="block mb-2 text-[#555] font-medium">Password</label>
                        <input type="password" name="password" onChange={handleChange} required placeholder="Create password" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                    </div>

                    <div className="mb-8">
                        <label className="block mb-2 text-[#555] font-medium">Confirm Password</label>
                        <input type="password" name="password_confirmation" onChange={handleChange} required placeholder="Confirm password" className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]" />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full p-3 bg-[#007bff] text-white border-none rounded text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#0056b3]"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-5 text-center text-[#666]">
                    Already have an account? <Link to="/login" className="text-[#007bff] no-underline font-medium hover:underline">Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
