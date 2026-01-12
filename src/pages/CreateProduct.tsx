import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category_id: '',
        product_type_id: '',
        contact: '',
        expiry: '',
        lat: '',
        lng: ''
    });
    const [files, setFiles] = useState<FileList | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/form-data').then(res => {
            setCategories(res.data.categories);
            setTypes(res.data.types);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        lat: position.coords.latitude.toString(),
                        lng: position.coords.longitude.toString()
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not get your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key as keyof typeof formData]);
        });
        
        if (files) {
            for (let i = 0; i < files.length; i++) {
                data.append('images[]', files[i]);
            }
        }

        try {
            await api.post('/products', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create product');
            console.error(err.response?.data);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h2>Post New Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title:</label>
                    <input type="text" name="title" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Description:</label>
                    <textarea name="description" onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Price:</label>
                    <input type="number" name="price" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Category:</label>
                    <select name="category_id" onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Type:</label>
                    <select name="product_type_id" onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Type</option>
                        {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Contact Info:</label>
                    <input type="text" name="contact" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                    <label>Location (Optional):</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="lat" value={formData.lat} placeholder="Latitude" readOnly style={{ width: '45%', padding: '8px', background: '#eee' }} />
                        <input type="text" name="lng" value={formData.lng} placeholder="Longitude" readOnly style={{ width: '45%', padding: '8px', background: '#eee' }} />
                    </div>
                    <button type="button" onClick={getLocation} style={{ marginTop: '5px', padding: '5px 10px', background: '#ccc', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Get Current Location</button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Images:</label>
                    <input type="file" multiple onChange={handleFileChange} style={{ width: '100%', padding: '8px' }} accept="image/*" />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none' }}>Post Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;
