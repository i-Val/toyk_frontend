import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

interface AdminContactDetail {
    id: number;
    name: string;
    email: string;
    subject?: string | null;
    message: string;
    status: boolean;
    created_at: string;
}

const AdminContactDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [contact, setContact] = useState<AdminContactDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContact = async () => {
            if (!id) {
                setError('Invalid contact id');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await api.get(`/admin/contacts/${id}`);
                setContact(res.data);
            } catch (e) {
                console.error('Failed to load contact details', e);
                setError('Failed to load contact details');
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [id]);

    if (loading) {
        return <div>Loading contact...</div>;
    }

    if (error) {
        return <div className="text-red-600">{error}</div>;
    }

    if (!contact) {
        return <div>Contact not found</div>;
    }

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Contact Message</h1>
                    <span className="text-xs text-blue-100">Dashboard / MESSAGES / DETAIL</span>
                </div>
                <button
                    onClick={() => navigate('/admin/contacts')}
                    className="px-3 py-1 text-xs font-semibold border border-white rounded hover:bg-white hover:text-blue-600"
                >
                    Back to list
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Name
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {contact.name}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Email
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {contact.email}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Subject
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {contact.subject || '-'}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Status
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm">
                        <span
                            className={
                                contact.status
                                    ? 'inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700'
                                    : 'inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700'
                            }
                        >
                            {contact.status ? 'Read' : 'Unread'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Date
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900">
                        {new Date(contact.created_at).toLocaleString()}
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-2 text-sm font-semibold text-gray-600">
                        Message
                    </div>
                    <div className="col-span-12 md:col-span-10 text-sm text-gray-900 whitespace-pre-line">
                        {contact.message}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContactDetails;

