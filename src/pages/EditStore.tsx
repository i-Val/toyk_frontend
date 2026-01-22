import { useState, useEffect } from 'react';
import api from '../api/axios';
import UserSidebar from '../components/UserSidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast, usePageLoader } from '../components/UiFeedbackProvider';

const EditStore = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: null as File | null,
        banner: null as File | null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const res = await api.get('/my-stores');
                const store = res.data.find((s: any) => s.id === Number(id));
                if (store) {
                    setFormData({
                        name: store.name,
                        description: store.description || '',
                        logo: null,
                        banner: null
                    });
                } else {
                    showToast('Store not found', 'error');
                    navigate('/profile/stores');
                }
            } catch (err) {
                showToast('Failed to fetch store details', 'error');
            } finally {
                setLoading(false);
                stopLoading();
            }
        };
        startLoading();
        fetchStore();
    }, [id, navigate, showToast, startLoading, stopLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [e.target.name]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startLoading();
        
        const data = new FormData();
        data.append('name', formData.name);
        if (formData.description) data.append('description', formData.description);
        if (formData.logo) data.append('logo', formData.logo);
        if (formData.banner) data.append('banner', formData.banner);

        try {
            await api.post(`/stores/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('Store updated successfully');
            navigate('/profile/stores');
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to update store', 'error');
        } finally {
            stopLoading();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="profile-wrapper">
            <UserSidebar />
            <div style={{ flex: 1, border: '1px solid #ddd', padding: '20px', borderRadius: '4px' }}>
                <h2>Edit Store</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
                    <div>
                        <label>Store Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
                    </div>
                    <div>
                        <label>Logo (Leave empty to keep current)</label>
                        <input type="file" name="logo" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <div>
                        <label>Banner (Leave empty to keep current)</label>
                        <input type="file" name="banner" onChange={handleFileChange} accept="image/*" />
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: 'fit-content' }}>
                        Update Store
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditStore;
