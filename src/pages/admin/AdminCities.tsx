import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface StateItem {
    id: number;
    name: string;
}

interface CityItem {
    id: number;
    name: string;
    state_id: number;
    state?: StateItem;
}

const AdminCities = () => {
    const [states, setStates] = useState<StateItem[]>([]);
    const [cities, setCities] = useState<CityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stateFilter, setStateFilter] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        state_id: '',
    });
    const [editingCity, setEditingCity] = useState<CityItem | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchStates();
        fetchCities();
    }, []);

    const fetchStates = async () => {
        try {
            const res = await api.get<({ id: number; name: string })[]>('/admin/states');
            const mapped = res.data.map(s => ({
                id: s.id,
                name: s.name,
            }));
            setStates(mapped);
        } catch (error) {
            console.error('Failed to fetch states', error);
        }
    };

    const fetchCities = async (params?: { search?: string; state_id?: string }) => {
        setLoading(true);
        try {
            const res = await api.get<CityItem[]>('/admin/cities', {
                params: {
                    search: params?.search || undefined,
                    state_id: params?.state_id || undefined,
                },
            });
            setCities(res.data);
        } catch (error) {
            console.error('Failed to fetch cities', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.state_id) {
            showToast('Please select a state', 'error');
            return;
        }

        try {
            if (editingCity) {
                const res = await api.put<CityItem>(`/admin/cities/${editingCity.id}`, {
                    name: formData.name,
                    state_id: Number(formData.state_id),
                });

                const state = states.find(s => s.id === res.data.state_id);

                setCities(prev =>
                    prev.map(c =>
                        c.id === editingCity.id ? { ...res.data, state } : c
                    )
                );
                showToast('City updated successfully');
            } else {
                const res = await api.post<CityItem>('/admin/cities', {
                    name: formData.name,
                    state_id: Number(formData.state_id),
                });

                const state = states.find(s => s.id === res.data.state_id);

                setCities(prev => [{ ...res.data, state }, ...prev]);
                showToast('City created successfully');
            }

            setFormData({
                name: '',
                state_id: '',
            });
            setEditingCity(null);
        } catch (error) {
            console.error('Failed to save city', error);
            showToast('Failed to save city', 'error');
        }
    };

    const handleEdit = (city: CityItem) => {
        setEditingCity(city);
        setFormData({
            name: city.name || '',
            state_id: String(city.state_id),
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete City',
            message: 'Are you sure you want to delete this city?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/cities/${id}`);
            setCities(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete city', error);
            showToast('Failed to delete city', 'error');
        }
    };

    const handleResetForm = () => {
        setEditingCity(null);
        setFormData({
            name: '',
            state_id: '',
        });
    };

    const handleSearch = () => {
        fetchCities({
            search,
            state_id: stateFilter || undefined,
        });
    };

    const handleResetSearch = () => {
        setSearch('');
        setStateFilter('');
        fetchCities();
    };

    const filteredCities = cities;

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">City List</h1>
                    <span className="text-xs text-blue-100">Dashboard / CityList</span>
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
                            value={stateFilter}
                            onChange={e => setStateFilter(e.target.value)}
                            className="border rounded px-3 py-2 text-sm w-full md:w-56"
                        >
                            <option value="">All States</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id}>
                                    {state.name}
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
                                {editingCity ? 'Edit City' : 'Add City'}
                            </h2>
                            {editingCity && (
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
                                <label className="block text-xs font-medium mb-1">State</label>
                                <select
                                    value={formData.state_id}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            state_id: e.target.value,
                                        }))
                                    }
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state.id} value={state.id}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">City Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="City Name"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingCity ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-2 border border-gray-200 rounded p-4">
                        <h2 className="text-sm font-semibold mb-4">City List</h2>
                        {loading ? (
                            <div>Loading cities...</div>
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
                                                State Name
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCities.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-4 border text-center text-sm text-gray-500"
                                                >
                                                    No City Found
                                                </td>
                                            </tr>
                                        )}
                                        {filteredCities.map((city, index) => (
                                            <tr key={city.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border text-sm">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {city.name}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {city.state?.name ||
                                                        states.find(s => s.id === city.state_id)?.name ||
                                                        '-'}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(city)}
                                                        className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(city.id)}
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

export default AdminCities;
