import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminProducts = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    const fetchProducts = async (pageNo: number) => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/products?page=${pageNo}`);
            setProducts(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/admin/products/${id}`);
                fetchProducts(page);
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h1>Manage Products</h1>
            {loading ? <p>Loading...</p> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Image</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Title</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Price</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>User</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Category</th>
                                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.id}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        {product.images && product.images.length > 0 && (
                                            <img 
                                                src={`http://localhost:8000/storage/products/120/${product.images[0].image.split('/').pop()}`} 
                                                alt="thumb" 
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        )}
                                    </td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.title}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>${product.price}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.user?.first_name} {product.user?.last_name}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{product.category?.title}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                        <button 
                                            onClick={() => handleDelete(product.id)} 
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

export default AdminProducts;