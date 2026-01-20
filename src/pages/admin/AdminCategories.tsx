import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Category {
    id: number;
    title: string;
    slug?: string;
    description?: string | null;
    fa_icon?: string | null;
    image?: string | null;
    type?: string | null;
    children?: Category[];
}

const AdminCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        fa_icon: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await api.get('/categories');
            setCategories(res.data || []);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Category',
            message: 'Are you sure you want to delete this category?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
            showToast('Category deleted successfully');
        } catch (error) {
            console.error('Failed to delete category', error);
            showToast('Failed to delete category', 'error');
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                const res = await api.put(`/admin/categories/${editingCategory.id}`, formData);
                setCategories(prev =>
                    prev.map(c => (c.id === editingCategory.id ? { ...c, ...res.data } : c)),
                );
                showToast('Category updated successfully');
            } else {
                const res = await api.post('/admin/categories', formData);
                setCategories(prev => [...prev, res.data]);
                showToast('Category created successfully');
            }
            setEditingCategory(null);
            setFormData({ title: '', slug: '', description: '', fa_icon: '' });
            setShowForm(false);
        } catch (error) {
            console.error('Failed to save category', error);
            showToast('Failed to save category', 'error');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            title: category.title,
            slug: category.slug || '',
            description: category.description || '',
            fa_icon: category.fa_icon || '',
        });
        setShowForm(true);
    };

    const handleCancel = () => {
        setEditingCategory(null);
        setFormData({ title: '', slug: '', description: '', fa_icon: '' });
        setShowForm(false);
    };

    const filteredCategories = categories.filter(category =>
        category.title.toLowerCase().includes(search.toLowerCase()),
    );

    const getIconCell = (category: Category) => {
        if (!category.image) {
            return 'Not Uploaded';
        }
        return 'Not Uploaded';
    };

    const getTotalSubcategories = (category: Category) => {
        if (!category.children || category.children.length === 0) {
            return 0;
        }
        return category.children.length;
    };

    const isFeatured = (category: Category) => category.type === 'featured';

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Category List</h1>
                    <span className="text-xs text-blue-100">Dashboard / CategoryList</span>
                </div>
                <button
                    type="button"
                    onClick={() => setShowForm(open => !open)}
                    className="px-4 py-2 text-sm font-semibold bg-white text-blue-600 rounded shadow hover:bg-blue-50"
                >
                    {showForm ? 'Close' : 'Add Category'}
                </button>
            </div>
            <div className="p-6">
                <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-full max-w-xs">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
                    </div>
                </div>

                {showForm && (
                    <div className="mb-6 border border-gray-200 rounded p-4 bg-gray-50">
                        <h3 className="text-sm font-semibold mb-3">
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
                            <input
                                type="text"
                                placeholder="Title"
                                value={formData.title}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Slug"
                                value={formData.slug}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        slug: e.target.value,
                                    }))
                                }
                                required
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="FontAwesome Icon (e.g. fa-car)"
                                value={formData.fa_icon}
                                onChange={e =>
                                    setFormData(prev => ({
                                        ...prev,
                                        fa_icon: e.target.value,
                                    }))
                                }
                                className="border rounded px-3 py-2 text-sm"
                            />
                            <div className="flex gap-3 mt-1">
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingCategory ? 'Update Category' : 'Create Category'}
                                </button>
                                {editingCategory && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-4 py-2 text-sm font-semibold bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div>Loading categories...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        No
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Icon
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Featured
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Total Subcategories
                                    </th>
                                    <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-4 border text-center text-sm text-gray-500"
                                        >
                                            No Category Found
                                        </td>
                                    </tr>
                                )}
                                {filteredCategories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border text-sm">{index + 1}</td>
                                        <td className="px-4 py-2 border text-sm">
                                            {getIconCell(category)}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">{category.title}</td>
                                        <td className="px-4 py-2 border text-sm">
                                            {isFeatured(category) && (
                                                <span className="text-yellow-400 text-lg">★</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            {getTotalSubcategories(category)}
                                        </td>
                                        <td className="px-4 py-2 border text-sm">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(category)}
                                                className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(category.id)}
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
                )}
            </div>
        </div>
    );
};

export default AdminCategories;
