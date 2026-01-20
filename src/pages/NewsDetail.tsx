import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { usePageLoader } from '../components/UiFeedbackProvider';

interface BlogPost {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    content: string;
    created_at: string;
}

const NewsDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
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
        api.get(`/blog/${slug}`)
            .then(res => {
                setPost(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blog post", err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return null;
    if (!post) return <div style={{ padding: '40px', textAlign: 'center' }}>Post not found</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: 'auto' }}>
            <Link to="/news" style={{ display: 'inline-block', marginBottom: '20px', color: '#666', textDecoration: 'none' }}>&larr; Back to News</Link>
            <h1 style={{ fontSize: '2.5em', marginBottom: '10px' }}>{post.title}</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>{new Date(post.created_at).toLocaleDateString()}</p>
            {post.image && (
                <img src={post.image} alt={post.title} style={{ width: '100%', borderRadius: '10px', marginBottom: '30px' }} />
            )}
            <div 
                dangerouslySetInnerHTML={{ __html: post.content }} 
                style={{ lineHeight: '1.8', fontSize: '1.1em', color: '#333' }}
            />
        </div>
    );
};

export default NewsDetail;
