import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Plans = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/plans')
            .then(res => {
                setPlans(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch plans", err);
                setLoading(false);
            });
    }, []);

    const handleSubscribe = async (planId: number) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (confirm("Confirm subscription to this plan? (Mock Payment)")) {
            try {
                await api.post('/subscribe', { plan_id: planId });
                alert("Subscribed successfully!");
                navigate('/dashboard');
            } catch (err) {
                console.error("Failed to subscribe", err);
                alert("Failed to subscribe");
            }
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Membership Plans</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {plans.map(plan => (
                    <div key={plan.id} style={{ 
                        border: '1px solid #ddd', 
                        borderRadius: '10px', 
                        padding: '30px',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ color: '#333' }}>{plan.title}</h2>
                        <p style={{ color: '#666', minHeight: '60px' }}>{plan.description}</p>
                        <h3 style={{ color: '#007bff', fontSize: '2em', margin: '20px 0' }}>
                            {plan.currency_code} {plan.price}
                        </h3>
                        <p style={{ color: '#888' }}>Duration: {plan.days} days</p>
                        <button 
                            style={{ 
                                padding: '12px 30px', 
                                background: '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '25px', 
                                fontSize: '1.1em',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                            onClick={() => handleSubscribe(plan.id)}
                        >
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;