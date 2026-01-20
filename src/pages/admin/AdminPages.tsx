import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm, usePageLoader } from '../../components/UiFeedbackProvider';

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
        const confirmed = await confirm({
            title: 'Delete Page',
            message: 'Are you sure you want to delete this page?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/admin/pages/${id}`);
            setPages(pages.filter(p => p.id !== id));
            showToast('Page deleted successfully');
        } catch (error) {
            console.error("Failed to delete page", error);
            showToast('Failed to delete page', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPage) {
                const res = await api.put(`/admin/pages/${editingPage.id}`, formData);
                setPages(pages.map(p => p.id === editingPage.id ? res.data : p));
                showToast('Page updated successfully');
            } else {
                const res = await api.post('/admin/pages', formData);
                setPages([...pages, res.data]);
                showToast('Page created successfully');
            }
            setEditingPage(null);
            setFormData({ title: '', slug: '', description: '' });
        } catch (error) {
            console.error("Failed to save page", error);
            showToast('Failed to save page', 'error');
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

            {loading ? null : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                    Title
                                </th>
                                <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                    Slug
                                </th>
                                <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages.map(page => (
                                <tr key={page.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border text-sm">{page.title}</td>
                                    <td className="px-4 py-2 border text-sm">{page.slug}</td>
                                    <td className="px-4 py-2 border text-sm">
                                        <button
                                            onClick={() => handleEdit(page)}
                                            className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(page.id)}
                                            className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPages;
