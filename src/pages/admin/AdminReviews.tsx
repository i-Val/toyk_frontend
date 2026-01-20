import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useToast } from '../../components/UiFeedbackProvider';

interface AdminReview {
    id: number;
    rating: number;
    comment: string;
    status?: boolean | number;
    created_at: string;
    user?: {
        first_name: string;
        last_name: string;
    };
    product?: {
        title: string;
    };
}

const AdminReviews = () => {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        fetchReviews(page, search);
    }, [page, search]);

    const fetchReviews = async (pageNo: number, searchQuery: string) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/reviews', {
                params: {
                    page: pageNo,
                    search: searchQuery || undefined,
                },
            });

            setReviews(res.data.data || []);
            setTotalPages(res.data.last_page || 1);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (review: AdminReview) => {
        try {
            const res = await api.post(`/admin/reviews/${review.id}/toggle-status`);
            if (res.data.status) {
                setReviews(prev =>
                    prev.map(r =>
                        r.id === review.id ? { ...r, status: r.status ? 0 : 1 } : r
                    )
                );
                showToast('Review status updated successfully');
            } else {
                showToast(res.data.msg || 'Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        }
    };

    const formatDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

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

    const getStatusLabel = (status: AdminReview['status']) => {
        if (status === undefined || status === null) {
            return 'Active';
        }
        return status ? 'Active' : 'Inactive';
    };

    const isActive = (status: AdminReview['status']) => {
        if (status === undefined || status === null) {
            return true;
        }
        return Boolean(status);
    };

    const getCommentExcerpt = (comment: string) => {
        if (!comment) {
            return '-';
        }
        if (comment.length <= 60) {
            return comment;
        }
        return comment.slice(0, 57) + '...';
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Review List</h1>
                    <span className="text-xs text-blue-100">Dashboard / REVIEWS</span>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            value={search}
                            onChange={e => {
                                setPage(1);
                                setSearch(e.target.value);
                            }}
                            placeholder="Search by post, user, rating or text..."
                            className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                            🔍
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div>Loading reviews...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        No
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Post
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        User
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Review
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Rating
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-4 border text-center text-sm text-gray-500"
                                        >
                                            No Reviews Found
                                        </td>
                                    </tr>
                                )}
                                {reviews.map((review, index) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border text-sm">
                                            {(page - 1) * 20 + index + 1}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {review.product ? review.product.title : '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {review.user
                                                ? `${review.user.first_name} ${review.user.last_name}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {getCommentExcerpt(review.comment)}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium">
                                                    {review.rating.toFixed(1)}
                                                </span>
                                                <span>{renderStars(review.rating)}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <span className="mr-2 text-xs font-semibold">
                                                {getStatusLabel(review.status)}
                                            </span>
                                            <button
                                                onClick={() => handleToggleStatus(review)}
                                                className={`inline-flex items-center w-12 h-6 rounded-full p-1 transition-colors ${
                                                    isActive(review.status)
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                                        isActive(review.status)
                                                            ? 'translate-x-6'
                                                            : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {formatDate(review.created_at)}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <button
                                                onClick={() => navigate(`/admin/reviews/${review.id}`)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-4 flex items-center justify-center gap-3 text-sm">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminReviews;
