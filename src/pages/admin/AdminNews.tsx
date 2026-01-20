import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm, usePageLoader } from '../../components/UiFeedbackProvider';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
}

const AdminNews = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: ''
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
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/blog');
            setPosts(res.data);
        } catch (error) {
            console.error("Failed to fetch blog posts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Post',
            message: 'Are you sure you want to delete this post?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/admin/blog/${id}`);
            setPosts(posts.filter(p => p.id !== id));
            showToast('Post deleted successfully');
        } catch (error) {
            console.error("Failed to delete post", error);
            showToast('Failed to delete post', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPost) {
                const res = await api.put(`/admin/blog/${editingPost.id}`, formData);
                setPosts(posts.map(p => p.id === editingPost.id ? res.data : p));
                showToast('Post updated successfully');
            } else {
                const res = await api.post('/admin/blog', formData);
                setPosts([res.data, ...posts]);
                showToast('Post created successfully');
            }
            setEditingPost(null);
            setFormData({ title: '', content: '', image: '' });
        } catch (error) {
            console.error("Failed to save post", error);
            showToast('Failed to save post', 'error');
        }
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            image: post.image || ''
        });
    };

    const handleCancel = () => {
        setEditingPost(null);
        setFormData({ title: '', content: '', image: '' });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage News / Blog</h1>

            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
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
                        placeholder="Image URL (Optional)" 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})}
                        style={{ padding: '8px' }}
                    />
                    <textarea 
                        placeholder="Content (HTML allowed)" 
                        value={formData.content} 
                        onChange={e => setFormData({...formData, content: e.target.value})}
                        required
                        style={{ padding: '8px', minHeight: '200px' }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                            {editingPost ? 'Update' : 'Create'}
                        </button>
                        {editingPost && (
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
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border text-sm">{post.title}</td>
                                    <td className="px-4 py-2 border text-sm">{post.slug}</td>
                                    <td className="px-4 py-2 border text-sm">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
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

export default AdminNews;
