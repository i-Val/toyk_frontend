import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface AdminProduct {
    id: number;
    title: string;
    price: number;
    status: boolean;
    is_featured: boolean;
    expiry: string | null;
    created_at: string;
    user?: {
        first_name: string;
        last_name: string;
    };
    category?: {
        title: string;
    };
    ad_type?: 'free' | 'upgraded';
}

const AdminProducts = () => {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchProducts(page, search);
    }, [page, search]);

    const fetchProducts = async (pageNo: number, searchQuery: string) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/products', {
                params: {
                    page: pageNo,
                    search: searchQuery || undefined,
                },
            });

            setProducts(res.data.data || []);
            setTotalPages(res.data.last_page || 1);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (product: AdminProduct) => {
        try {
            const res = await api.post(`/admin/products/${product.id}/toggle-status`);
            if (res.data.status) {
                setProducts(prev =>
                    prev.map(p =>
                        p.id === product.id ? { ...p, status: !p.status } : p
                    )
                );
                showToast('Post status updated successfully');
            } else {
                showToast(res.data.msg || 'Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        }
    };

    const handleToggleFeatured = async (product: AdminProduct) => {
        try {
            const res = await api.post(`/admin/products/${product.id}/toggle-featured`);
            if (res.data.status) {
                setProducts(prev =>
                    prev.map(p =>
                        p.id === product.id ? { ...p, is_featured: !p.is_featured } : p
                    )
                );
                showToast('Featured flag updated successfully');
            } else {
                showToast(res.data.msg || 'Failed to update featured flag', 'error');
            }
        } catch (error) {
            console.error('Failed to update featured flag', error);
            showToast('Failed to update featured flag', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Post',
            message: 'Are you sure you want to delete this post?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete post', error);
            showToast('Failed to delete post', 'error');
        }
    };

    const formatDate = (value: string | null) => {
        if (!value) {
            return 'N/A';
        }
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

    const getPlanLabel = (product: AdminProduct) => {
        if (product.ad_type === 'upgraded') {
            return 'Upgraded';
        }
        if (product.ad_type === 'free') {
            return 'Free';
        }
        return '-';
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Post List</h1>
                    <span className="text-xs text-blue-100">Dashboard / POST</span>
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
                            placeholder="Search..."
                            className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                            🔍
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div>Loading posts...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        No
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        User Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Featured
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Plan
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Post Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Expiration Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-4 text-center text-sm text-gray-500 border-b border-gray-100"
                                        >
                                            No Posts Found
                                        </td>
                                    </tr>
                                )}
                                {products.map((product, index) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {(page - 1) * 20 + index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {product.title}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {product.user
                                                ? `${product.user.first_name} ${product.user.last_name}`
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <button
                                                onClick={() => handleToggleFeatured(product)}
                                                className="text-yellow-400 text-lg"
                                            >
                                                {product.is_featured ? '★' : '☆'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {getPlanLabel(product)}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <span className="mr-2 text-xs font-semibold">
                                                {product.status ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleStatus(product)}
                                                className={`inline-flex items-center w-12 h-6 rounded-full p-1 transition-colors ${
                                                    product.status ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                                        product.status ? 'translate-x-6' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {formatDate(product.created_at)}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {formatDate(product.expiry)}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
                                            >
                                                Delete
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

export default AdminProducts;
