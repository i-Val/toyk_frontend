import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

interface AdminReviewDetail {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user?: {
        first_name: string;
        last_name: string;
    };
    product?: {
        title: string;
    };
}

const AdminReviewDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [review, setReview] = useState<AdminReviewDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReview = async () => {
            if (!id) {
                setError('Invalid review id');
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await api.get(`/admin/reviews/${id}`);
                setReview(res.data);
            } catch (e) {
                console.error('Failed to load review details', e);
                setError('Failed to load review details');
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [id]);

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (loading) {
        return <div>Loading review...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    if (!review) {
        return <div>Review not found</div>;
    }

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Rating and Review Information</h1>
                    <span className="text-xs text-blue-100">Dashboard / REVIEWS / DETAIL</span>
                </div>
                <button
                    onClick={() => navigate('/admin/reviews')}
                    className="px-3 py-1 text-xs font-semibold border border-white rounded hover:bg-white hover:text-blue-600"
                >
                    Back to list
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Post
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {review.product ? review.product.title : '-'}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        User
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {review.user
                            ? `${review.user.first_name} ${review.user.last_name}`
                            : '-'}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Rating
                    </div>
                    <div className="col-span-12 md:col-span-10 flex items-center gap-2 text-sm text-gray-900">
                        <span>{renderStars(review.rating)}</span>
                        <span className="text-xs text-gray-600">
                            {review.rating.toFixed(1)} / 5
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Review
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900 whitespace-pre-line">
                        {review.comment}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReviewDetails;

