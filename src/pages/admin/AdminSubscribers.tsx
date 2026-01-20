import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Subscriber {
    id: number;
    email: string;
    status: boolean;
    created_at: string;
}

interface SubscribersResponse {
    data: Subscriber[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    total_subscribers?: number;
}

const AdminSubscribers = () => {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubscribers, setTotalSubscribers] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchSubscribers(page, search);
    }, [page, search]);

    const fetchSubscribers = async (pageNo: number, searchQuery: string) => {
        setLoading(true);
        try {
            const res = await api.get<SubscribersResponse>('/admin/subscribers', {
                params: {
                    page: pageNo,
                    search: searchQuery || undefined,
                },
            });

            setSubscribers(res.data.data || []);
            setTotalPages(res.data.last_page || 1);
            if (typeof res.data.total_subscribers === 'number') {
                setTotalSubscribers(res.data.total_subscribers);
            } else {
                setTotalSubscribers(res.data.total);
            }
        } catch (error) {
            console.error('Failed to fetch subscribers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (subscriber: Subscriber) => {
        try {
            const res = await api.post(`/admin/subscribers/${subscriber.id}/toggle-status`);
            if (res.data.status) {
                setSubscribers(prev =>
                    prev.map(s =>
                        s.id === subscriber.id ? { ...s, status: !s.status } : s
                    )
                );
                showToast('Subscriber status updated successfully');
            } else {
                showToast(res.data.msg || 'Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Subscriber',
            message: 'Are you sure you want to delete this subscriber?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/subscribers/${id}`);
            setSubscribers(prev => prev.filter(s => s.id !== id));
            setTotalSubscribers(prev =>
                prev !== null && prev > 0 ? prev - 1 : prev
            );
        } catch (error) {
            console.error('Failed to delete subscriber', error);
            showToast('Failed to delete subscriber', 'error');
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

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Newsletter List</h1>
                    <span className="text-xs text-blue-100">
                        Dashboard / NewsletterList
                    </span>
                    <div className="text-xs mt-1">
                        Total Subscribers - {totalSubscribers ?? '...'}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded">
                        Send Updates To Subscribers
                    </button>
                    <button className="px-3 py-1 text-xs font-semibold bg-blue-500 hover:bg-blue-700 text-white rounded">
                        Manage Layouts
                    </button>
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
                    <button
                        onClick={() => {
                            setSearch('');
                            setPage(1);
                        }}
                        className="ml-4 px-3 py-2 text-sm border rounded bg-gray-50 hover:bg-gray-100"
                    >
                        Reset
                    </button>
                </div>

                {loading ? (
                    <div>Loading subscribers...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        No
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Created
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscribers.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-4 border text-center text-sm text-gray-500"
                                        >
                                            No Subscribers Found
                                        </td>
                                    </tr>
                                )}
                                {subscribers.map((subscriber, index) => (
                                    <tr key={subscriber.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border text-sm">
                                            {(page - 1) * 20 + index + 1}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {subscriber.email}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <span className="mr-2 text-xs font-semibold">
                                                {subscriber.status ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleStatus(subscriber)}
                                                className={`inline-flex items-center w-12 h-6 rounded-full p-1 transition-colors ${
                                                    subscriber.status
                                                        ? 'bg-blue-600'
                                                        : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                                        subscriber.status
                                                            ? 'translate-x-6'
                                                            : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {formatDate(subscriber.created_at)}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <button
                                                onClick={() => handleDelete(subscriber.id)}
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

export default AdminSubscribers;
