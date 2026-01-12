import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface Page {
    id: number;
    title: string;
    slug: string;
    description: string;
}

const AdminPages = () => {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState<Page | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: ''
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/pages');
            setPages(res.data);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this page?")) {
            try {
                await api.delete(`/admin/pages/${id}`);
                setPages(pages.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete page", error);
                alert("Failed to delete page");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPage) {
                const res = await api.put(`/admin/pages/${editingPage.id}`, formData);
                setPages(pages.map(p => p.id === editingPage.id ? res.data : p));
            } else {
                const res = await api.post('/admin/pages', formData);
                setPages([...pages, res.data]);
            }
            setEditingPage(null);
            setFormData({ title: '', slug: '', description: '' });
        } catch (error) {
            console.error("Failed to save page", error);
            alert("Failed to save page");
        }
    };

    const handleEdit = (page: Page) => {
        setEditingPage(page);
        setFormData({
            title: page.title,
            slug: page.slug,
            description: page.description
        });
    };

    const handleCancel = () => {
        setEditingPage(null);
        setFormData({ title: '', slug: '', description: '' });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage Static Pages</h1>
            
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>{editingPage ? 'Edit Page' : 'Add New Page'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', maxWidth: '800px' }}>
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
                        placeholder="Content (HTML)" 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                        style={{ padding: '8px', minHeight: '200px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                            {editingPage ? 'Update' : 'Create'}
                        </button>
                        {editingPage && (
                            <button type="button" onClick={handleCancel} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {loading ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#f8f9fa' }}>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Title</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Slug</th>
                            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map(page => (
                            <tr key={page.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{page.title}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{page.slug}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <button onClick={() => handleEdit(page)} style={{ marginRight: '10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(page.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPages;