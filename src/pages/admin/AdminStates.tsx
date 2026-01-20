import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Country {
    id: number;
    name: string;
}

interface StateItem {
    id: number;
    name: string;
    country_id: number;
    country?: Country;
}

const AdminStates = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<StateItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [countryFilter, setCountryFilter] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        country_id: '',
    });
    const [editingState, setEditingState] = useState<StateItem | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchCountries();
        fetchStates();
    }, []);

    const fetchCountries = async () => {
        try {
            const res = await api.get<Country[]>('/admin/countries');
            setCountries(res.data);
        } catch (error) {
            console.error('Failed to fetch countries', error);
        }
    };

    const fetchStates = async (params?: { search?: string; country_id?: string }) => {
        setLoading(true);
        try {
            const res = await api.get<StateItem[]>('/admin/states', {
                params: {
                    search: params?.search || undefined,
                    country_id: params?.country_id || undefined,
                },
            });
            setStates(res.data);
        } catch (error) {
            console.error('Failed to fetch states', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.country_id) {
            showToast('Please select a country', 'error');
            return;
        }

        try {
            if (editingState) {
                const res = await api.put<StateItem>(`/admin/states/${editingState.id}`, {
                    name: formData.name,
                    country_id: Number(formData.country_id),
                });

                const country = countries.find(c => c.id === res.data.country_id);

                setStates(prev =>
                    prev.map(s =>
                        s.id === editingState.id ? { ...res.data, country } : s
                    )
                );
                showToast('State updated successfully');
            } else {
                const res = await api.post<StateItem>('/admin/states', {
                    name: formData.name,
                    country_id: Number(formData.country_id),
                });

                const country = countries.find(c => c.id === res.data.country_id);

                setStates(prev => [{ ...res.data, country }, ...prev]);
                showToast('State created successfully');
            }

            setFormData({
                name: '',
                country_id: '',
            });
            setEditingState(null);
        } catch (error) {
            console.error('Failed to save state', error);
            showToast('Failed to save state', 'error');
        }
    };

    const handleEdit = (state: StateItem) => {
        setEditingState(state);
        setFormData({
            name: state.name || '',
            country_id: String(state.country_id),
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete State',
            message: 'Are you sure you want to delete this state?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/states/${id}`);
            setStates(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error('Failed to delete state', error);
            showToast('Failed to delete state', 'error');
        }
    };

    const handleResetForm = () => {
        setEditingState(null);
        setFormData({
            name: '',
            country_id: '',
        });
    };

    const handleSearch = () => {
        fetchStates({
            search,
            country_id: countryFilter || undefined,
        });
    };

    const handleResetSearch = () => {
        setSearch('');
        setCountryFilter('');
        fetchStates();
    };

    const filteredStates = states;

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">State List</h1>
                    <span className="text-xs text-blue-100">Dashboard / StateList</span>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                                🔍
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={countryFilter}
                            onChange={e => setCountryFilter(e.target.value)}
                            className="border rounded px-3 py-2 text-sm w-full md:w-56"
                        >
                            <option value="">All Countries</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleResetSearch}
                            className="px-3 py-2 text-sm font-semibold bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 border border-gray-200 rounded p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold">
                                {editingState ? 'Edit State' : 'Add State'}
                            </h2>
                            {editingState && (
                                <button
                                    type="button"
                                    onClick={handleResetForm}
                                    className="text-xs text-blue-600 border border-blue-600 rounded px-2 py-1 hover:bg-blue-50"
                                >
                                    Add New
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium mb-1">Country</label>
                                <select
                                    value={formData.country_id}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            country_id: e.target.value,
                                        }))
                                    }
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(country => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">State Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="State Name"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingState ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-2 border border-gray-200 rounded p-4">
                        <h2 className="text-sm font-semibold mb-4">State List</h2>
                        {loading ? (
                            <div>Loading states...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                No
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Country Name
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStates.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-4 border text-center text-sm text-gray-500"
                                                >
                                                    No State Found
                                                </td>
                                            </tr>
                                        )}
                                        {filteredStates.map((state, index) => (
                                            <tr key={state.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border text-sm">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {state.name}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {state.country?.name ||
                                                        countries.find(c => c.id === state.country_id)?.name ||
                                                        '-'}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(state)}
                                                        className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(state.id)}
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
            </div>
        </div>
    );
};

export default AdminStates;
