import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Country {
    id: number;
    sortname: string;
    name: string;
    phonecode: string;
}

const AdminCountries = () => {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        sortname: '',
        name: '',
        phonecode: '',
    });
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchCountries();
    }, []);

    const fetchCountries = async (searchQuery?: string) => {
        setLoading(true);
        try {
            const res = await api.get<Country[]>('/admin/countries', {
                params: {
                    search: searchQuery || undefined,
                },
            });
            setCountries(res.data);
        } catch (error) {
            console.error('Failed to fetch countries', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (editingCountry) {
                const res = await api.put<Country>(`/admin/countries/${editingCountry.id}`, formData);
                setCountries(prev =>
                    prev.map(c => (c.id === editingCountry.id ? res.data : c))
                );
                showToast('Country updated successfully');
            } else {
                const res = await api.post<Country>('/admin/countries', formData);
                setCountries(prev => [res.data, ...prev]);
                showToast('Country created successfully');
            }

            setFormData({
                sortname: '',
                name: '',
                phonecode: '',
            });
            setEditingCountry(null);
        } catch (error) {
            console.error('Failed to save country', error);
            showToast('Failed to save country', 'error');
        }
    };

    const handleEdit = (country: Country) => {
        setEditingCountry(country);
        setFormData({
            sortname: country.sortname || '',
            name: country.name || '',
            phonecode: country.phonecode || '',
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Country',
            message: 'Are you sure you want to delete this country?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/countries/${id}`);
            setCountries(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete country', error);
            showToast('Failed to delete country', 'error');
        }
    };

    const handleResetForm = () => {
        setEditingCountry(null);
        setFormData({
            sortname: '',
            name: '',
            phonecode: '',
        });
    };

    const handleSearch = () => {
        fetchCountries(search);
    };

    const handleResetSearch = () => {
        setSearch('');
        fetchCountries('');
    };

    const filteredCountries = countries;

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Country List</h1>
                    <span className="text-xs text-blue-100">Dashboard / CountryList</span>
                </div>
            </div>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full max-w-md">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
                                🔍
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="px-3 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Search
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
                                {editingCountry ? 'Edit Country' : 'Add Country'}
                            </h2>
                            {editingCountry && (
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
                                <label className="block text-xs font-medium mb-1">Short Name</label>
                                <input
                                    type="text"
                                    value={formData.sortname}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            sortname: e.target.value,
                                        }))
                                    }
                                    placeholder="Short Name"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="Name"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Phone Code</label>
                                <input
                                    type="text"
                                    value={formData.phonecode}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            phonecode: e.target.value,
                                        }))
                                    }
                                    placeholder="Phone Code"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingCountry ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-2 border border-gray-200 rounded p-4">
                        <h2 className="text-sm font-semibold mb-4">Country List</h2>
                        {loading ? (
                            <div>Loading countries...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                No
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Short Name
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Name
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Phone Code
                                            </th>
                                            <th className="px-4 py-2 border text-left text-xs font-semibold text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCountries.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-4 border text-center text-sm text-gray-500"
                                                >
                                                    No Country Found
                                                </td>
                                            </tr>
                                        )}
                                        {filteredCountries.map((country, index) => (
                                            <tr key={country.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border text-sm">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {country.sortname}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {country.name}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    {country.phonecode}
                                                </td>
                                                <td className="px-4 py-2 border text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(country)}
                                                        className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(country.id)}
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

export default AdminCountries;
