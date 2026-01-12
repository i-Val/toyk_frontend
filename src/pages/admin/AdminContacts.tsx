import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminContacts = () => {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchContacts(page);
    }, [page]);

    const fetchContacts = async (pageNo: number) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/contacts?page=${pageNo}`);
            setContacts(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this message?")) {
            try {
                await api.delete(`/admin/contacts/${id}`);
                fetchContacts(page);
            } catch (error) {
                console.error("Failed to delete message", error);
                alert("Failed to delete message");
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Contact Messages</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Subject</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Message</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map(contact => (
                                <tr key={contact.id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.email}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.subject}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{contact.message}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(contact.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button 
                                            onClick={() => handleDelete(contact.id)} 
                                            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete
                                        </button>
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

export default AdminContacts;