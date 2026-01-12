import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const AdminReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
        if (confirm("Are you sure you want to delete this report?")) {
            try {
                await api.delete(`/admin/reports/${id}`);
                fetchReports(page);
            } catch (error) {
                console.error("Failed to delete report", error);
                alert("Failed to delete report");
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Reported Ads</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Product</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Reason</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Comments</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Date</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map(report => (
                                <tr key={report.id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{report.id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {report.product ? (
                                            <Link to={`/products/${report.product.id}`}>{report.product.title}</Link>
                                        ) : 'Product Deleted'}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{report.reason}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{report.comments}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(report.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button 
                                            onClick={() => handleDelete(report.id)} 
                                            style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Delete Report
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

export default AdminReports;