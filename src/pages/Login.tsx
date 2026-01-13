import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            login(response.data.access_token, response.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
            <div className="w-full max-w-[400px] bg-white p-10 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <h2 className="text-center text-[#333] mb-8 text-[2rem]">Login</h2>
                {error && <div className="bg-[#ffebee] text-[#c62828] p-2.5 rounded mb-5 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-[#555] font-medium">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder="Enter your email"
                            className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-[#555] font-medium">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder="Enter your password"
                            className="w-full p-3 rounded border border-[#ddd] outline-none text-base bg-white text-[#333] focus:border-[#007bff]"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full p-3 bg-[#007bff] text-white border-none rounded text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#0056b3]"
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-5 text-center text-[#666]">
                    Don't have an account? <Link to="/register" className="text-[#007bff] no-underline font-medium hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
