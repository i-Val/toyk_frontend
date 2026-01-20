import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { usePageLoader } from '../components/UiFeedbackProvider';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    created_at: string;
    content: string; // Add this if you need to show a snippet
}

const News = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
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
        api.get('/blog')
            .then(res => {
                setPosts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blog posts", err);
                setLoading(false);
            });
    }, []);

    if (loading) return null;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>News & Updates</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {posts.map(post => (
                    <div key={post.id} style={{ border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden' }}>
                        {post.image ? (
                            <img src={post.image} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '200px', background: '#f4f4f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                                No Image
                            </div>
                        )}
                        <div style={{ padding: '20px' }}>
                            <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>
                                <Link to={`/news/${post.slug}`} style={{ textDecoration: 'none', color: '#333' }}>{post.title}</Link>
                            </h2>
                            <p style={{ color: '#666', fontSize: '0.9em' }}>{new Date(post.created_at).toLocaleDateString()}</p>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>
                                {post.content.substring(0, 100).replace(/<[^>]*>?/gm, '')}...
                            </p>
                            <Link to={`/news/${post.slug}`} style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Read More &rarr;</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
