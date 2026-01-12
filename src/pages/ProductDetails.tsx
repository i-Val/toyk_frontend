import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    category: { name: string };
    product_type: { name: string };
    user: { id: number; first_name: string; last_name: string };
    contact: string;
    created_at: string;
    images: { image: string }[];
    total_views: number;
    is_wishlisted?: boolean;
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

    const getImageUrl = (path: string) => {
        return `http://localhost:8000/storage/${path}`;
    };

    const toggleWishlist = () => {
        if (!product) return;
        api.post(`/wishlists/toggle/${product.id}`)
            .then(res => {
                setProduct(prev => prev ? { ...prev, is_wishlisted: res.data.status === 'added' } : null);
            })
            .catch(console.error);
    };

    const submitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;
        setSubmittingReview(true);
        try {
            const res = await api.post(`/products/${product.id}/reviews`, newReview);
            setReviews(prev => [res.data, ...prev]);
            setNewReview({ rating: 5, comment: '' });
        } catch (err) {
            console.error("Failed to submit review", err);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    const reportAd = async () => {
        if (!product) return;
        const reason = prompt("Please enter the reason for reporting this ad:");
        if (reason) {
            try {
                await api.post(`/products/${product.id}/report`, { reason });
                alert("Ad reported successfully.");
            } catch (error) {
                console.error("Failed to report ad", error);
                alert("Failed to report ad.");
            }
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>&larr; Back to Products</Link>
            
            <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                {/* Images Section */}
                <div>
                    {selectedImage ? (
                        <div style={{ marginBottom: '10px' }}>
                            <img 
                                src={getImageUrl(selectedImage)} 
                                alt={product.title} 
                                style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', border: '1px solid #ddd' }} 
                            />
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '300px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No Image Available
                        </div>
                    )}
                    
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                            {product.images.map((img, idx) => (
                                <img 
                                    key={idx}
                                    src={getImageUrl(img.image)} 
                                    alt={`Thumbnail ${idx}`} 
                                    onClick={() => setSelectedImage(img.image)}
                                    style={{ 
                                        width: '80px', 
                                        height: '80px', 
                                        objectFit: 'cover', 
                                        cursor: 'pointer',
                                        border: selectedImage === img.image ? '2px solid blue' : '1px solid #ddd' 
                                    }} 
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h1 style={{ margin: '0 0 10px 0' }}>{product.title}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button 
                                onClick={reportAd} 
                                style={{ padding: '8px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                Report Ad
                            </button>
                            <button 
                                onClick={toggleWishlist}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    cursor: 'pointer',
                                    fontSize: '32px',
                                    color: product.is_wishlisted ? 'red' : '#ccc'
                                }}
                            >
                                ♥
                            </button>
                        </div>
                    </div>
                    <h2 style={{ color: 'green', margin: '0 0 20px 0' }}>${product.price}</h2>
                    
                    <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                        <p><strong>Category:</strong> {product.category.name}</p>
                        <p><strong>Type:</strong> {product.product_type.name}</p>
                        <p><strong>Posted by:</strong> {product.user.first_name} {product.user.last_name}</p>
                        <p><strong>Contact:</strong> {product.contact}</p>
                        <p><strong>Views:</strong> {product.total_views}</p>
                        <p><strong>Posted:</strong> {new Date(product.created_at).toLocaleDateString()}</p>
                    </div>

                    <div>
                        <h3>Description</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{product.description || 'No description provided.'}</p>
                    </div>

                    {/* Reviews Section */}
                    <div style={{ marginTop: '40px' }}>
                        <h3>Reviews ({reviews.length})</h3>
                        
                        {authUser ? (
                            <form onSubmit={submitReview} style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
                                <h4>Write a Review</h4>
                                <div style={{ marginBottom: '10px' }}>
                                    <label>Rating: </label>
                                    <select 
                                        value={newReview.rating} 
                                        onChange={e => setNewReview({...newReview, rating: Number(e.target.value)})}
                                        style={{ padding: '5px' }}
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
                                        style={{ width: '100%', minHeight: '80px', padding: '10px' }}
                                        required
                                    />
                                </div>
                                <button type="submit" disabled={submittingReview} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        ) : (
                            <p>Please <Link to="/login">login</Link> to write a review.</p>
                        )}

                        <div>
                            {reviews.length === 0 ? (
                                <p>No reviews yet.</p>
                            ) : (
                                reviews.map(review => (
                                    <div key={review.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <strong>{review.user.first_name} {review.user.last_name}</strong>
                                            <span style={{ color: 'orange' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</span>
                                        </div>
                                        <p style={{ margin: '5px 0' }}>{review.comment}</p>
                                        <small style={{ color: '#888' }}>{new Date(review.created_at).toLocaleDateString()}</small>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
