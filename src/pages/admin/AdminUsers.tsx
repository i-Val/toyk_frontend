import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface AdminUser {
    id: number;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    status: boolean;
    is_admin: boolean;
}

const AdminUsers = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchUsers(page, search);
    }, [page, search]);

    const fetchUsers = async (pageNo: number, searchQuery: string) => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users', {
                params: {
                    page: pageNo,
                    search: searchQuery || undefined,
                },
            });

            setUsers(res.data.data || []);
            setTotalPages(res.data.last_page || 1);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user: AdminUser) => {
        try {
            const res = await api.post(`/admin/users/${user.id}/toggle-status`);
            if (res.data.status) {
                setUsers(prev =>
                    prev.map(u =>
                        u.id === user.id ? { ...u, status: !u.status } : u
                    )
                );
                showToast('User status updated successfully');
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
            title: 'Delete User',
            message: 'Are you sure you want to delete this user?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            showToast('Failed to delete user', 'error');
        }
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Users List</h1>
                    <span className="text-xs text-blue-100">Dashboard / UserList</span>
                </div>
                <button className="bg-white text-blue-600 font-semibold py-1 px-4 rounded shadow-sm hover:bg-gray-100 text-sm">
                    Add User
                </button>
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
                    <div>Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        No
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        First Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Last Name
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Phone
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-4 text-center text-sm text-gray-500 border-b border-gray-100"
                                        >
                                            No Users Found
                                        </td>
                                    </tr>
                                )}
                                {users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {(page - 1) * 20 + index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {user.first_name}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {user.last_name}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {user.phone}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <span className="mr-2 text-xs font-semibold">
                                                {user.status ? 'Active' : 'Inactive'}
                                            </span>
                                            {!user.is_admin && (
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`inline-flex items-center w-12 h-6 rounded-full p-1 transition-colors ${
                                                        user.status
                                                            ? 'bg-blue-600'
                                                            : 'bg-gray-300'
                                                    }`}
                                                >
                                                    <span
                                                        className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                                            user.status
                                                                ? 'translate-x-6'
                                                                : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {!user.is_admin && (
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            )}
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

export default AdminUsers;
