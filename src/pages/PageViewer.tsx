import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { usePageLoader } from '../components/UiFeedbackProvider';

const PageViewer = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<{ title: string; description: string } | null>(null);
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
        api.get(`/pages/${slug}`)
            .then(res => {
                setPage(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return null;
    if (!page) return <div style={{ padding: '20px', textAlign: 'center' }}>Page not found</div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: 'auto' }}>
            <h1>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.description }} />
        </div>
    );
};

export default PageViewer;
