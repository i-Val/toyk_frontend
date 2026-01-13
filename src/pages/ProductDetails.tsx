import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface Review {
    id: number;
    user: { first_name: string; last_name: string };
    rating: number;
    comment: string;
    created_at: string;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: { title: string };
    product_type: { name: string };
    user: { id: number; first_name: string; last_name: string; created_at: string };
    contact: string;
    created_at: string;
    images: { image: string }[];
    total_views: number;
    is_wishlisted?: boolean;
    city?: string;
    state?: string;
}

const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { user: authUser } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
                if (res.data.images && res.data.images.length > 0) {
                    setSelectedImage(res.data.images[0].image);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details');
            }
        };

        const fetchReviews = async () => {
            try {
                const res = await api.get(`/products/${id}/reviews`);
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to load reviews", err);
            }
        };

        Promise.all([fetchProduct(), fetchReviews()]).then(() => setLoading(false));
    }, [id]);

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!authUser) return;
        setSubmittingReview(true);
        try {
            const res = await api.post(`/products/${id}/reviews`, newReview);
            setReviews([res.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
        } catch (err) {
            console.error("Failed to submit review", err);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const getImageUrl = (path: string) => {
        if (path.startsWith('http')) return path;
        return `http://localhost:8000/storage/${path}`;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!product) return <div>Product not found</div>;

    const averageRating = reviews.length > 0 
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e4e5e9', fontSize: '1.2em' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: '1px solid #f0f0f0'
    };

    const sectionHeaderStyle = {
        color: '#0056b3',
        margin: '0 0 15px 0',
        fontSize: '1.2em',
        fontWeight: 'bold'
    };

    return (
        <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            
            <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 20px' }}>
                <h1 style={{ fontSize: '2em', marginBottom: '20px', color: '#333' }}>{product.title}</h1>
                
                <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', flexWrap: 'wrap' }}>
                    
                    {/* Left Column */}
                    <div style={{ flex: '2', minWidth: '300px' }}>
                        
                        {/* Images Section */}
                        <div style={{ background: '#fff', marginBottom: '20px', borderRadius: '8px', overflow: 'hidden' }}>
                            {selectedImage ? (
                                <div style={{ height: '400px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img 
                                        src={getImageUrl(selectedImage)} 
                                        alt={product.title} 
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                    />
                                </div>
                            ) : (
                                <div style={{ height: '400px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    No Image Available
                                </div>
                            )}
                            
                            {/* Thumbnails */}
                            {product.images && product.images.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', padding: '10px', overflowX: 'auto', borderTop: '1px solid #eee' }}>
                                    {product.images.map((img, idx) => (
                                        <div 
                                            key={idx}
                                            onClick={() => setSelectedImage(img.image)}
                                            style={{ 
                                                width: '80px', 
                                                height: '60px', 
                                                border: selectedImage === img.image ? '2px solid #0056b3' : '1px solid #ddd',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img 
                                                src={getImageUrl(img.image)} 
                                                alt={`Thumb ${idx}`} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionHeaderStyle}>Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '5px' }}>PRODUCT</div>
                                    <div style={{ color: '#555' }}>{product.title}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '5px' }}>CATEGORY</div>
                                    <div style={{ color: '#555' }}>{product.category?.title || 'N/A'}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#888', fontSize: '0.85em', textTransform: 'uppercase', marginBottom: '5px' }}>SUB CATEGORY</div>
                                    <div style={{ color: '#555' }}>{product.product_type?.name || 'N/A'}</div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionHeaderStyle}>Description</h3>
                            <p style={{ whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6' }}>
                                {product.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div style={cardStyle}>
                            <h3 style={sectionHeaderStyle}>Rating & Reviews</h3>
                            {reviews.length === 0 ? (
                                <p style={{ color: '#777' }}>No Reviews</p>
                            ) : (
                                <div>
                                    {reviews.map(review => (
                                        <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '15px 0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                <strong style={{ color: '#333' }}>{review.user.first_name} {review.user.last_name}</strong>
                                                <div>{renderStars(review.rating)}</div>
                                            </div>
                                            <p style={{ margin: '5px 0', color: '#555' }}>{review.comment}</p>
                                            <small style={{ color: '#999' }}>{formatDate(review.created_at)}</small>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {authUser && (
                                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                    <h4 style={{ marginBottom: '10px' }}>Write a Review</h4>
                                    <form onSubmit={submitReview}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <select 
                                                value={newReview.rating} 
                                                onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                                                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                            >
                                                <option value="5">5 Stars</option>
                                                <option value="4">4 Stars</option>
                                                <option value="3">3 Stars</option>
                                                <option value="2">2 Stars</option>
                                                <option value="1">1 Star</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '10px' }}>
                                            <textarea 
                                                placeholder="Your review..." 
                                                value={newReview.comment}
                                                onChange={e => setNewReview({...newReview, comment: e.target.value})}
                                                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                                                required
                                            />
                                        </div>
                                        <button type="submit" disabled={submittingReview} style={{ padding: '8px 16px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        
                        {/* Price Card */}
                        <div style={cardStyle}>
                            <h2 style={{ fontSize: '2.5em', color: '#0056b3', margin: '0 0 5px 0' }}>$ {product.price.toLocaleString()}</h2>
                            <div style={{ color: '#777', marginBottom: '10px' }}>{product.title}</div>
                            <div style={{ marginBottom: '10px' }}>
                                {renderStars(Math.round(Number(averageRating) || 0))}
                                <span style={{ marginLeft: '10px', color: '#777' }}>
                                    Average Rating : {renderStars(Math.round(Number(averageRating) || 0))}
                                </span>
                            </div>
                            <div style={{ color: '#999', fontSize: '0.9em' }}>{formatDate(product.created_at)}</div>
                        </div>

                        {/* Seller Description Card */}
                        <div style={cardStyle}>
                            <h3 style={sectionHeaderStyle}>Seller Description</h3>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#eee', overflow: 'hidden', marginRight: '15px' }}>
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${product.user.first_name}+${product.user.last_name}&background=random`} 
                                        alt="Seller" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{product.user.first_name} {product.user.last_name}</div>
                                    <div style={{ color: '#888', fontSize: '0.85em' }}>Member Since {formatDate(product.user.created_at)}</div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <button style={{ flex: 1, padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9em' }}>
                                    FOLLOW
                                </button>
                                <button style={{ flex: 1, padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9em' }}>
                                    MAIL TO SELLER
                                </button>
                            </div>
                            
                            <div style={{ textAlign: 'center', color: '#333' }}>
                                <span style={{ fontSize: '1.5em' }}>📞</span>
                            </div>
                        </div>

                        {/* Posted In Card */}
                        <div style={cardStyle}>
                            <h3 style={sectionHeaderStyle}>Posted In</h3>
                            <div style={{ color: '#555' }}>
                                {product.city || product.state || 'Location not specified'}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
