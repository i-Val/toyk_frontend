import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Category {
    id: number;
    title: string;
    slug: string;
    description: string;
    fa_icon: string;
}

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        fa_icon: ''
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await api.delete(`/admin/categories/${id}`);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete category", error);
                alert("Failed to delete category");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const res = await api.put(`/admin/categories/${editingCategory.id}`, formData);
                setCategories(categories.map(c => c.id === editingCategory.id ? res.data : c));
            } else {
                const res = await api.post('/admin/categories', formData);
                setCategories([...categories, res.data]);
            }
            setEditingCategory(null);
            setFormData({ title: '', slug: '', description: '', fa_icon: '' });
        } catch (error) {
            console.error("Failed to save category", error);
            alert("Failed to save category");
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            slug: category.slug,
            description: category.description || '',
            fa_icon: category.fa_icon || ''
        });
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setFormData({ title: '', slug: '', description: '', fa_icon: '' });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage Categories</h1>
            
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '500px' }}>
                    <input 
                        type="text" 
                        placeholder="Title" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                        style={{ padding: '8px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="Slug" 
                        value={formData.slug} 
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        required
                        style={{ padding: '8px' }}
                    />
                    <textarea 
                        placeholder="Description" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <input 
                        type="text" 
                        placeholder="FontAwesome Icon (e.g. fa-car)" 
                        value={formData.fa_icon} 
                        onChange={e => setFormData({...formData, fa_icon: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </button>
                        {editingCategory && (
                            <button type="button" onClick={handleCancel} style={{ padding: '10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading ? <p>Loading...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {categories.map(category => (
                        <div key={category.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                            <h3>{category.title}</h3>
                            <p style={{ color: '#666' }}>{category.description}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button 
                                    onClick={() => handleEdit(category)} 
                                    style={{ background: '#ffc107', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(category.id)} 
                                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>
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

export default AdminCategories;