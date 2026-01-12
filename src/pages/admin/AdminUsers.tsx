import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (pageNo: number) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/users?page=${pageNo}`);
            setUsers(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchUsers(page);
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user");
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage Users</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Role</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.first_name} {user.last_name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.is_admin ? 'Admin' : 'User'}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {!user.is_admin && (
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminUsers;