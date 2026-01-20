import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm, usePageLoader } from '../../components/UiFeedbackProvider';

interface Plan {
    id: number;
    title: string;
    description: string;
    price: string;
    currency_code: string;
    days: number;
}

const AdminPlans = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency_code: 'NGN',
        days: 30
    });
    const { showToast } = useToast();
    const { confirm } = useConfirm();
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
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await api.get('/plans');
            setPlans(res.data);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Plan',
            message: 'Are you sure you want to delete this plan?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/admin/plans/${id}`);
            setPlans(plans.filter(p => p.id !== id));
            showToast('Plan deleted successfully');
        } catch (error) {
            console.error("Failed to delete plan", error);
            showToast('Failed to delete plan', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                const res = await api.put(`/admin/plans/${editingPlan.id}`, formData);
                setPlans(plans.map(p => p.id === editingPlan.id ? res.data : p));
                showToast('Plan updated successfully');
            } else {
                const res = await api.post('/admin/plans', formData);
                setPlans([...plans, res.data]);
                showToast('Plan created successfully');
            }
            setEditingPlan(null);
            setFormData({ title: '', description: '', price: '', currency_code: 'NGN', days: 30 });
        } catch (error) {
            console.error("Failed to save plan", error);
            showToast('Failed to save plan', 'error');
        }
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setFormData({
            title: plan.title,
            description: plan.description || '',
            price: plan.price,
            currency_code: plan.currency_code,
            days: plan.days
        });
    };

    const handleCancel = () => {
        setEditingPlan(null);
        setFormData({ title: '', description: '', price: '', currency_code: 'NGN', days: 30 });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage Membership Plans</h1>
            
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        style={{ padding: '8px' }}
                    />
                    <textarea 
                        placeholder="Description" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <input 
                            type="number" 
                            placeholder="Price" 
                            value={formData.price} 
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            required
                            style={{ padding: '8px' }}
                        />
                        <select 
                            value={formData.currency_code} 
                            onChange={e => setFormData({...formData, currency_code: e.target.value})}
                            style={{ padding: '8px' }}
                        >
                            <option value="NGN">NGN</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <input 
                        type="number" 
                        placeholder="Duration (days)" 
                        value={formData.days} 
                        onChange={e => setFormData({...formData, days: parseInt(e.target.value)})}
                        required
                        style={{ padding: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {editingPlan ? 'Update Plan' : 'Create Plan'}
                        </button>
                        {editingPlan && (
                            <button type="button" onClick={handleCancel} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading ? null : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {plans.map(plan => (
                        <div key={plan.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                            <h3>{plan.title}</h3>
                            <p style={{ color: '#666' }}>{plan.description}</p>
                            <div style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '10px 0' }}>
                                {plan.currency_code} {plan.price}
                            </div>
                            <div style={{ marginBottom: '15px' }}>Duration: {plan.days} days</div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button 
                                    onClick={() => handleEdit(plan)} 
                                    style={{ background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(plan.id)} 
                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPlans;
