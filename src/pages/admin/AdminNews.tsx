import { useEffect, useState } from 'react';
import api from '../../api/axios';

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
        if (confirm("Are you sure you want to delete this post?")) {
            try {
                await api.delete(`/admin/blog/${id}`);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete post", error);
                alert("Failed to delete post");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPost) {
                const res = await api.put(`/admin/blog/${editingPost.id}`, formData);
                setPosts(posts.map(p => p.id === editingPost.id ? res.data : p));
            } else {
                const res = await api.post('/admin/blog', formData);
                setPosts([res.data, ...posts]);
            }
            setEditingPost(null);
            setFormData({ title: '', content: '', image: '' });
        } catch (error) {
            console.error("Failed to save post", error);
            alert("Failed to save post");
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
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{post.title}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{post.slug}</td>
                                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
                                    <button onClick={() => handleEdit(post)} style={{ marginRight: '10px', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(post.id)} style={{ color: 'red', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminNews;