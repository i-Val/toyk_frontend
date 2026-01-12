import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import api from '../api/axios';

interface Payment {
    id: number;
    amount: string;
    currency: string;
    payment_method: string;
    status: string;
    transaction_id: string;
    created_at: string;
    description: string;
}

const Payments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await api.get('/payments');
                setPayments(res.data);
            } catch (err: any) {
                setError('Failed to fetch payments');
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div style={{ maxWidth: '1200px', margin: 'auto', padding: '20px', display: 'flex', gap: '30px' }}>
            <UserSidebar />
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0 }}>Payments</h2>
                
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!loading && payments.length === 0 && (
                    <p>No payment history found.</p>
                )}

                {payments.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Date</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Amount</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Method</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Transaction ID</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        {payment.currency} {payment.amount}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        {payment.payment_method}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        {payment.transaction_id || '-'}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                        <span style={{ 
                                            padding: '4px 8px', 
                                            borderRadius: '4px',
                                            backgroundColor: payment.status === 'completed' ? '#d4edda' : '#fff3cd',
                                            color: payment.status === 'completed' ? '#155724' : '#856404',
                                            fontSize: '12px'
                                        }}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Payments;
