import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/UiFeedbackProvider';

interface Product {
    id: number;
    title: string;
    price: number;
    category: { title: string };
    product_type: { name: string };
    user: { first_name: string; last_name: string };
    created_at: string;
    images: { image: string }[];
    is_wishlisted?: boolean;
}

const ProductList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [types, setTypes] = useState<any[]>([]);
    const { showToast } = useToast();
    
    // Filter State
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
    const [typeId, setTypeId] = useState(searchParams.get('product_type_id') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'newest');
    const [lat, setLat] = useState<number | null>(null);
    const [lng, setLng] = useState<number | null>(null);

    useEffect(() => {
        // Sync state with URL params when URL changes
        setSearch(searchParams.get('search') || '');
        setCategoryId(searchParams.get('category_id') || '');
        setTypeId(searchParams.get('product_type_id') || '');
        setMinPrice(searchParams.get('min_price') || '');
        setMaxPrice(searchParams.get('max_price') || '');
        setSortBy(searchParams.get('sort_by') || 'newest');
    }, [searchParams]);

    useEffect(() => {
        // Fetch form data for filters
        api.get('/form-data').then(res => {
            setCategories(res.data.categories);
            setTypes(res.data.types);
        });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, categoryId, typeId, minPrice, maxPrice, sortBy, lat, lng]);

    const fetchProducts = () => {
        const params: any = {};
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;
        if (typeId) params.product_type_id = typeId;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sortBy) params.sort_by = sortBy;
        if (lat && lng) {
            params.lat = lat;
            params.lng = lng;
            params.radius = 500;
        }

        api.get('/products', { params })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error(error));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Update URL params
        const params: any = {};
        if (search) params.search = search;
        if (categoryId) params.category_id = categoryId;
        if (typeId) params.product_type_id = typeId;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (sortBy) params.sort_by = sortBy;
        setSearchParams(params);
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLng(position.coords.longitude);
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

    const getImageUrl = (path: string) => {
        return `http://localhost:8000/storage/${path}`;
    };

    const getThumbnailUrl = (path: string) => {
        // Convert "products/filename.jpg" to "products/300/filename.jpg"
        if (path.startsWith('products/')) {
            const filename = path.replace('products/', '');
            return `http://localhost:8000/storage/products/300/${filename}`;
        }
        return getImageUrl(path);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>Filters</h3>
                <form onSubmit={handleSearch} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                    <select 
                        value={categoryId} 
                        onChange={(e) => setCategoryId(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>{cat.title}</option>
                        ))}
                    </select>
                    <select 
                        value={typeId} 
                        onChange={(e) => setTypeId(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="">All Types</option>
                        {types.map((type: any) => (
                            <option key={type.id} value={type.id}>{type.title}</option> // Assuming type has title or name
                        ))}
                    </select>
                    <input 
                        type="number" 
                        placeholder="Min Price" 
                        value={minPrice} 
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                    />
                    <input 
                        type="number" 
                        placeholder="Max Price" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '100px' }}
                    />
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        {lat && <option value="distance">Distance</option>}
                    </select>
                    <button type="button" onClick={getLocation} style={{ padding: '8px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {lat ? 'Location Set' : 'Use My Location'}
                    </button>
                    <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Apply Filters
                    </button>
                    {(search || categoryId || typeId || minPrice || maxPrice || lat) && (
                        <button 
                            type="button" 
                            onClick={() => {
                                setSearch('');
                                setCategoryId('');
                                setTypeId('');
                                setMinPrice('');
                                setMaxPrice('');
                                setLat(null);
                                setLng(null);
                                setSortBy('newest');
                                setSearchParams({});
                            }}
                            style={{ padding: '8px 15px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                        {product.images && product.images.length > 0 && (
                            <img 
                                src={getThumbnailUrl(product.images[0].image)} 
                                alt={product.title} 
                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }}
                            />
                        )}
                        <h3>{product.title}</h3>
                        <p style={{ fontWeight: 'bold', color: '#007bff' }}>${product.price}</p>
                        <p>{product.category?.title} | {product.product_type?.name}</p>
                        <Link to={`/products/${product.id}`} style={{ display: 'block', marginTop: '10px', textAlign: 'center', background: '#007bff', color: 'white', padding: '10px', borderRadius: '5px', textDecoration: 'none' }}>
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;
