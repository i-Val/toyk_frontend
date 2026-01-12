import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Category {
    id: number;
    title: string;
    image: string | null;
    children?: Category[];
}

const TopCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    return (
        <div style={{ background: '#0056b3', padding: '10px 0', color: 'white' }}>
            <div style={{ maxWidth: '1200px', margin: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
                <div style={{ fontWeight: 'bold' }}>Top Categories</div>
                <div style={{ display: 'flex', gap: '20px', overflowX: 'auto' }}>
                    {categories.map(cat => (
                        <Link 
                            key={cat.id} 
                            to={`/products?category_id=${cat.id}`} 
                            style={{ color: 'white', textDecoration: 'none', whiteSpace: 'nowrap' }}
                        >
                            {cat.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopCategories;