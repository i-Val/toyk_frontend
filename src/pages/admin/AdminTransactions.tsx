import { useEffect, useState } from 'react';
import api from '../../api/axios';

interface AdminTransaction {
    id: number;
    transaction_id: string;
    currency: string;
    amount: number;
    status: string;
    description?: string | null;
    created_at: string;
}

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTransactions(page, search);
    }, [page, search]);

    const fetchTransactions = async (pageNo: number, searchQuery: string) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/transactions', {
                params: {
                    page: pageNo,
                    search: searchQuery || undefined,
                },
            });

            setTransactions(res.data.data || []);
            setTotalPages(res.data.last_page || 1);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
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

    const handleReset = () => {
        setSearch('');
        setPage(1);
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Transaction List</h1>
                    <span className="text-xs text-blue-100">Dashboard / TransactionList</span>
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
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="ml-3 px-4 py-2 text-sm font-semibold bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Reset
                    </button>
                </div>

                {loading ? (
                    <div>Loading transactions...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Post Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Transaction Id
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Currency
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Amount
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-4 text-center text-sm text-gray-500 border-b border-gray-100"
                                        >
                                            No Result Found
                                        </td>
                                    </tr>
                                )}
                                {transactions.map(transaction => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">{transaction.id}</td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {transaction.description || '-'}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {transaction.transaction_id}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {transaction.currency}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">{transaction.amount}</td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">{transaction.status}</td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {formatDate(transaction.created_at)}
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

export default AdminTransactions;
