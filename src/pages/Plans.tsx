import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast, usePageLoader } from '../components/UiFeedbackProvider';

type Plan = {
    id: number;
    title: string;
    description: string | null;
    price: number;
    currency_code: string;
    days: number;
};

const Plans = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();

    useEffect(() => {
        if (loading) {
            startLoading();
        } else {
            stopLoading();
        }

        return () => {
            stopLoading();
        };
    }, [loading, startLoading, stopLoading]);

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

        setSubscribing(true);

        try {
            const res = await api.post('/subscribe/init', { plan_id: planId });
            const authorizationUrl = res.data?.authorization_url;

            if (authorizationUrl) {
                window.location.href = authorizationUrl;
            } else {
                showToast('Failed to start payment.', 'error');
            }
        } catch (err) {
            console.error("Failed to start payment", err);
            showToast('Failed to start payment.', 'error');
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) return null;

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
                                background: subscribing ? '#6c757d' : '#007bff', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '25px', 
                                fontSize: '1.1em',
                                cursor: subscribing ? 'not-allowed' : 'pointer',
                                marginTop: '20px',
                                opacity: subscribing ? 0.8 : 1
                            }}
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={subscribing}
                        >
                            {subscribing ? 'Redirecting...' : 'Choose Plan'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Plans;
