import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Slide {
    id: number;
    title: string;
    button_title: string;
    image: string | null;
    status: boolean;
}

type Mode = 'list' | 'create' | 'edit';

const AdminSlides = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState<Mode>('list');
    const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);
    const [title, setTitle] = useState('');
    const [buttonTitle, setButtonTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchSlides();
    }, []);

    const resetForm = () => {
        setCurrentSlide(null);
        setTitle('');
        setButtonTitle('');
        setFile(null);
    };

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/slides');
            if (res.data.status) {
                setSlides(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch slides', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateForm = () => {
        resetForm();
        setMode('create');
    };

    const openEditForm = (slide: Slide) => {
        setCurrentSlide(slide);
        setTitle(slide.title || '');
        setButtonTitle(slide.button_title || '');
        setFile(null);
        setMode('edit');
    };

    const handleCancel = () => {
        resetForm();
        setMode('list');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            showToast('Slide title is required', 'error');
            return;
        }
        if (mode === 'create' && !file) {
            showToast('Slide image is required', 'error');
            return;
        }

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('button_title', buttonTitle);
            if (file) {
                formData.append('file', file);
            }
            if (mode === 'edit' && currentSlide) {
                formData.append('id', String(currentSlide.id));
            }

            const res = await api.post('/admin/slides', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.data.status) {
                await fetchSlides();
                handleCancel();
                showToast(
                    mode === 'edit' ? 'Slide updated successfully' : 'Slide created successfully',
                );
            } else {
                showToast(res.data.msg || 'Failed to save slide', 'error');
            }
        } catch (error) {
            console.error('Failed to save slide', error);
            showToast('Failed to save slide', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleStatus = async (slide: Slide) => {
        try {
            const res = await api.post(`/admin/slides/${slide.id}/toggle`);
            if (res.data.status) {
                setSlides(prev =>
                    prev.map(s =>
                        s.id === slide.id ? { ...s, status: !s.status } : s
                    )
                );
                showToast('Slide status updated successfully');
            } else {
                showToast(res.data.msg || 'Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            showToast('Failed to update status', 'error');
        }
    };

    const handleDelete = async (slide: Slide) => {
        const confirmed = await confirm({
            title: 'Delete Slide',
            message: 'Are you sure you want to delete this slide?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }
        try {
            const res = await api.post(`/admin/slides/${slide.id}/delete`);
            if (res.data.status) {
                setSlides(prev => prev.filter(s => s.id !== slide.id));
                showToast('Slide deleted successfully');
            } else {
                showToast(res.data.msg || 'Failed to delete slide', 'error');
            }
        } catch (error) {
            console.error('Failed to delete slide', error);
            showToast('Failed to delete slide', 'error');
        }
    };

    if (mode !== 'list') {
        return (
            <div className="bg-white rounded shadow-sm">
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                    <span className="text-xl font-medium">Slide Information</span>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">
                                Slide Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="Title"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">
                                Slide Button Title
                            </label>
                            <input
                                type="text"
                                value={buttonTitle}
                                onChange={e => setButtonTitle(e.target.value)}
                                className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                                placeholder="Button Title"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">
                                Slide Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFile(e.target.files[0]);
                                    }
                                }}
                                className="block"
                            />
                            {currentSlide && currentSlide.image && (
                                <img
                                    src={currentSlide.image}
                                    alt="Current slide"
                                    className="mt-3 w-24 h-16 object-cover border"
                                />
                            )}
                        </div>
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
                            >
                                {saving ? 'Saving...' : 'Save Change'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <span className="text-xl font-medium">Slide List</span>
                <button
                    onClick={openCreateForm}
                    className="bg-white text-blue-600 font-semibold py-1 px-4 rounded shadow-sm hover:bg-gray-100"
                >
                    Add Slide
                </button>
            </div>
            <div className="p-6">
                {loading ? (
                    <div>Loading slides...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        No
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        Image
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {slides.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-4 text-center text-sm text-gray-500 border-b border-gray-100"
                                        >
                                            No Slides Found
                                        </td>
                                    </tr>
                                )}
                                {slides.map((slide, index) => (
                                    <tr key={slide.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 border-b border-gray-100">
                                            {slide.image ? (
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    className="w-16 h-12 object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-500">
                                                    Not Uploaded
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            {slide.title}
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <span className="mr-2 text-xs font-semibold">
                                                {slide.status ? 'Active' : 'Inactive'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleStatus(slide)}
                                                className={`inline-flex items-center w-12 h-6 rounded-full p-1 transition-colors ${
                                                    slide.status ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                                                        slide.status
                                                            ? 'translate-x-6'
                                                            : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 text-sm border-b border-gray-100">
                                            <button
                                                onClick={() => openEditForm(slide)}
                                                className="inline-flex items-center px-3 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slide)}
                                                className="inline-flex items-center px-3 py-1 text-xs font-semibold text-red-600 border border-red-600 rounded hover:bg-red-50"
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

export default AdminSlides;
