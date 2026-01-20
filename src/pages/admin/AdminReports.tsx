import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { useToast, useConfirm, usePageLoader } from '../../components/UiFeedbackProvider';

const AdminReports = () => {
    const [reports, setReports] = useState<any[]>([]);
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
        fetchReports(page);
    }, [page]);

    const fetchReports = async (pageNo: number) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/reports?page=${pageNo}`);
            setReports(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Report',
            message: 'Are you sure you want to delete this report?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/admin/reports/${id}`);
            fetchReports(page);
            showToast('Report deleted successfully');
        } catch (error) {
            console.error("Failed to delete report", error);
            showToast('Failed to delete report', 'error');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Reported Ads</h1>
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
                                        Product
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Reason
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Comments
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
                                {reports.map(report => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border text-sm">{report.id}</td>
                                        <td className="px-4 py-2 border text-sm">
                                            {report.product ? (
                                                <Link to={`/products/${report.product.id}`}>
                                                    {report.product.title}
                                                </Link>
                                            ) : (
                                                'Product Deleted'
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">{report.reason}</td>
                                        <td className="px-4 py-2 border text-sm">{report.comments}</td>
                                        <td className="px-4 py-2 border text-sm">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <button
                                                onClick={() => handleDelete(report.id)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
                                            >
                                                Delete Report
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

export default AdminReports;
