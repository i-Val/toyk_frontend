import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast, usePageLoader } from '../components/UiFeedbackProvider';

const FlutterwaveCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            // Flutterwave returns 'status', 'tx_ref', and 'transaction_id' in query params
            const status = searchParams.get('status');
            const tx_ref = searchParams.get('tx_ref');
            const transaction_id = searchParams.get('transaction_id');

            if (status !== 'successful' && status !== 'completed') {
                showToast('Payment was not successful.', 'error');
                navigate('/plans');
                return;
            }

            if (!transaction_id) {
                showToast('No transaction ID found.', 'error');
                navigate('/plans');
                return;
            }

            startLoading();

            try {
                // We send transaction_id to backend to verify with Flutterwave
                const response = await api.post('/subscribe/verify', { 
                    transaction_id, 
                    tx_ref,
                    gateway: 'flutterwave' 
                });
                
                if (response.status === 200) {
                    showToast('Payment verified successfully!', 'success');
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

export default FlutterwaveCallback;
