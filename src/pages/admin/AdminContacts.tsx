import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useToast, useConfirm, usePageLoader } from '../../components/UiFeedbackProvider';

interface Contact {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    status: boolean;
    created_at: string;
}

const AdminContacts = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { showToast } = useToast();
    const { confirm } = useConfirm();
    const { startLoading, stopLoading } = usePageLoader();

    useEffect(() => {
        if (loading) {
            startLoading();
        } else {
            stopLoading();
        }

        return () => {
            stopLoading();
        };
    }, [loading, startLoading, stopLoading]);

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
        const confirmed = await confirm({
            title: 'Delete Message',
            message: 'Are you sure you want to delete this message?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/admin/contacts/${id}`);
            fetchContacts(page);
            showToast('Message deleted successfully');
        } catch (error) {
            console.error("Failed to delete message", error);
            showToast('Failed to delete message', 'error');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Contact Messages</h1>
            {loading ? null : (
                <>
                    <div className="overflow-x-auto mt-5">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        ID
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Email
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Subject
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Message
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map(contact => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border text-sm">{contact.id}</td>
                                        <td className="px-4 py-2 border text-sm">{contact.name}</td>
                                        <td className="px-4 py-2 border text-sm">{contact.email}</td>
                                        <td className="px-4 py-2 border text-sm">{contact.subject}</td>
                                        <td className="px-4 py-2 border text-sm">{contact.message}</td>
                                        <td className="px-4 py-2 border text-sm">
                                            {new Date(contact.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <Link
                                                to={`/admin/contacts/${contact.id}`}
                                                className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
