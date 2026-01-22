import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast, useConfirm } from '../components/UiFeedbackProvider';

const EditProduct = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
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
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [files, setFiles] = useState<FileList | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [formDataRes, productRes] = await Promise.all([
                    api.get('/form-data'),
                    api.get(`/products/${id}`)
                ]);

                setCategories(formDataRes.data.categories);
                setTypes(formDataRes.data.types);

                const product = productRes.data;
                setFormData({
                    title: product.title,
                    description: product.description || '',
                    price: product.price,
                    category_id: product.category_id,
                    product_type_id: product.product_type_id,
                    contact: product.contact || '',
                    expiry: product.expiry || '',
                    lat: product.lat || '',
                    lng: product.lng || ''
                });
                setExistingImages(product.images || []);
            } catch (err) {
                console.error("Failed to fetch data", err);
                setError("Failed to load product data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                    showToast("Could not get your location.", 'error');
                }
            );
        } else {
            showToast("Geolocation is not supported by this browser.", 'error');
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        const confirmed = await confirm({
            title: 'Delete Image',
            message: 'Delete this image?',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/products/${id}/images/${imageId}`);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
            showToast('Image deleted successfully');
        } catch (err) {
            console.error("Failed to delete image", err);
            showToast("Failed to delete image", 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        // Method spoofing for PUT request with files
        data.append('_method', 'PUT');
        
        Object.keys(formData).forEach(key => {
            if (formData[key as keyof typeof formData]) {
                data.append(key, formData[key as keyof typeof formData]);
            }
        });
        
        if (files) {
            for (let i = 0; i < files.length; i++) {
                data.append('images[]', files[i]);
            }
        }

        try {
            await api.post(`/products/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            showToast('Product updated successfully');
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update product');
            console.error(err.response?.data);
            showToast(err.response?.data?.message || 'Failed to update product', 'error');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
            <h2>Edit Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Price:</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Category:</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Type:</label>
                    <select name="product_type_id" value={formData.product_type_id} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                        <option value="">Select Type</option>
                        {types.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Contact:</label>
                    <input type="text" name="contact" value={formData.contact} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Location:</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Lat" name="lat" value={formData.lat} onChange={handleChange} style={{ flex: 1, padding: '8px' }} />
                        <input type="text" placeholder="Lng" name="lng" value={formData.lng} onChange={handleChange} style={{ flex: 1, padding: '8px' }} />
                        <button type="button" onClick={getLocation} style={{ padding: '8px' }}>Get My Location</button>
                    </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                    <label>Current Images:</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {existingImages.map(img => (
                            <div key={img.id} style={{ position: 'relative' }}>
                                <img 
                                    src={`http://localhost:8000/storage/products/120/${img.image.split('/').pop()}`} 
                                    alt="Product" 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleDeleteImage(img.id)}
                                    style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>Add More Images:</label>
                    <input type="file" multiple onChange={handleFileChange} style={{ width: '100%', padding: '8px' }} />
                </div>

                <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Update Product
                </button>
            </form>
        </div>
    );
};

export default EditProduct;
