import { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import Newsletter from '../components/Newsletter';
import { Link } from 'react-router-dom';
import api from '../api/axios';

interface Product {
    id: number;
    title: string;
    price: number;
    images: { image: string }[];
    category: { title: string };
}

interface Category {
    id: number;
    title: string;
    image: string | null;
}

interface Slide {
    id: number;
    title: string;
    button_title: string;
    image: string | null;
}

const Home = () => {
    // const { user } = useAuth(); // Unused for now
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        // Fetch Recent Products
        api.get('/products?limit=8')
            .then(res => setRecentProducts(res.data))
            .catch(console.error);

        // Fetch Categories
        api.get('/categories')
            .then(res => setCategories(res.data.slice(0, 6))) // Show top 6
            .catch(console.error);

        // Fetch active slides for homepage hero
        api.get('/slides')
            .then(res => {
                if (res.data && res.data.status && Array.isArray(res.data.data)) {
                    setSlides(res.data.data);
                    setCurrentSlideIndex(0);
                }
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlideIndex(prev => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const getThumbnailUrl = (path: string) => {
        if (path.startsWith('products/')) {
            const filename = path.replace('products/', '');
            return `http://localhost:8000/storage/products/300/${filename}`;
        }
        return `http://localhost:8000/storage/${path}`;
    };

    const activeSlide = slides[currentSlideIndex] || null;

    const heroStyle: React.CSSProperties = activeSlide && activeSlide.image
        ? {
              background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${activeSlide.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              textAlign: 'center',
              padding: '100px 20px',
              marginBottom: '40px',
              backgroundColor: '#333',
          }
        : {
              background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("/hero-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: 'white',
              textAlign: 'center',
              padding: '100px 20px',
              marginBottom: '40px',
              backgroundColor: '#333',
          };

    return (
        <div>
            {/* Hero Section (Slider) */}
            <div style={heroStyle}>
                <h1 style={{ fontSize: '3em', marginBottom: '20px' }}>
                    {activeSlide?.title || 'Welcome to Toyk Market'}
                </h1>
                <p style={{ fontSize: '1.2em', marginBottom: '30px' }}>
                    Buy and sell everything from cars to mobile phones.
                </p>
                <Link
                    to="/products"
                    style={{
                        padding: '15px 30px',
                        background: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                    }}
                >
                    {activeSlide?.button_title || 'Start Browsing'}
                </Link>

                {slides.length > 1 && (
                    <div
                        style={{
                            marginTop: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '20px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentSlideIndex(prev =>
                                    prev === 0 ? slides.length - 1 : prev - 1
                                )
                            }
                            style={{
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            ‹
                        </button>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    type="button"
                                    onClick={() => setCurrentSlideIndex(index)}
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background:
                                            index === currentSlideIndex
                                                ? '#ffffff'
                                                : 'rgba(255,255,255,0.5)',
                                        cursor: 'pointer',
                                    }}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentSlideIndex(prev =>
                                    prev === slides.length - 1 ? 0 : prev + 1
                                )
                            }
                            style={{
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.4)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            <div style={{ maxWidth: '1200px', margin: 'auto', padding: '0 20px' }}>
                
                {/* Categories Grid */}
                <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Top Categories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                    {categories.map(cat => (
                        <Link key={cat.id} to={`/products?category_id=${cat.id}`} style={{ textDecoration: 'none', color: '#333', textAlign: 'center', display: 'block', padding: '20px', border: '1px solid #eee', borderRadius: '8px', transition: 'box-shadow 0.3s' }}>
                            <div style={{ fontSize: '2em', marginBottom: '10px' }}>📁</div>
                            <div style={{ fontWeight: 'bold' }}>{cat.title}</div>
                        </Link>
                    ))}
                </div>

                {/* Recent Products */}
                <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Recent Products</span>
                    <Link to="/products" style={{ fontSize: '0.8em', color: '#007bff', textDecoration: 'none' }}>View All</Link>
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {recentProducts.map(product => (
                        <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', transition: 'transform 0.2s' }}>
                            <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ height: '200px', background: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {product.images && product.images.length > 0 ? (
                                        <img 
                                            src={getThumbnailUrl(product.images[0].image)} 
                                            alt={product.title} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span style={{ color: '#999' }}>No Image</span>
                                    )}
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h3 style={{ margin: '0 0 10px', fontSize: '1.1em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.title}</h3>
                                    <p style={{ color: '#007bff', fontWeight: 'bold', fontSize: '1.2em', margin: 0 }}>${product.price}</p>
                                    <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>{product.category?.title}</div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <Newsletter />
        </div>
    );
};

export default Home;
