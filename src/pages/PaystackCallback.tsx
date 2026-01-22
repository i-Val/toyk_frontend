import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast, usePageLoader } from '../components/UiFeedbackProvider';

const PaystackCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            const reference = searchParams.get('reference') || searchParams.get('trxref');

            if (!reference) {
                showToast('No payment reference found.', 'error');
                navigate('/plans');
                return;
            }

            startLoading();

            try {
                const response = await api.post('/subscribe/verify', { reference });
                
                if (response.status === 200) {
                    showToast('Payment verified successfully!', 'success');
                    // Redirect to payments history or dashboard
                    navigate('/profile/payments');
                } else {
                    showToast('Payment verification failed.', 'error');
                    navigate('/plans');
                }
            } catch (error: any) {
                console.error('Payment verification error:', error);
                const message = error.response?.data?.message || 'Failed to verify payment.';
                showToast(message, 'error');
                navigate('/plans');
            } finally {
                stopLoading();
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate, showToast, startLoading, stopLoading]);

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh',
            textAlign: 'center' 
        }}>
            {verifying && (
                <>
                    <div className="spinner" style={{ 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid #3498db', 
                        borderRadius: '50%', 
                        width: '40px', 
                        height: '40px', 
                        animation: 'spin 1s linear infinite',
                        marginBottom: '20px'
                    }}></div>
                    <h2>Verifying your payment...</h2>
                    <p>Please do not close this window.</p>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
};

export default PaystackCallback;
