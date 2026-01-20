import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';
import { useToast, useConfirm } from '../../components/UiFeedbackProvider';

interface Currency {
    id: number;
    currency: string;
    currency_code: string;
}

const AdminCurrency = () => {
    const [currencies, setCurrencies] = useState<Currency[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        currency: '',
        currency_code: '',
    });
    const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
    const { showToast } = useToast();
    const { confirm } = useConfirm();

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const fetchCurrencies = async (searchQuery?: string) => {
        setLoading(true);
        try {
            const res = await api.get<Currency[]>('/admin/currencies', {
                params: {
                    search: searchQuery || undefined,
                },
            });
            setCurrencies(res.data);
        } catch (error) {
            console.error('Failed to fetch currencies', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (editingCurrency) {
                const res = await api.put<Currency>(`/admin/currencies/${editingCurrency.id}`, formData);
                setCurrencies(prev =>
                    prev.map(c => (c.id === editingCurrency.id ? res.data : c))
                );
                showToast('Currency updated successfully');
            } else {
                const res = await api.post<Currency>('/admin/currencies', formData);
                setCurrencies(prev => [res.data, ...prev]);
                showToast('Currency created successfully');
            }

            setFormData({
                currency: '',
                currency_code: '',
            });
            setEditingCurrency(null);
        } catch (error) {
            console.error('Failed to save currency', error);
            showToast('Failed to save currency', 'error');
        }
    };

    const handleEdit = (currency: Currency) => {
        setEditingCurrency(currency);
        setFormData({
            currency: currency.currency,
            currency_code: currency.currency_code,
        });
    };

    const handleDelete = async (id: number) => {
        const confirmed = await confirm({
            title: 'Delete Currency',
            message: 'Are you sure you want to delete this currency?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
        });
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/admin/currencies/${id}`);
            setCurrencies(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete currency', error);
            showToast('Failed to delete currency', 'error');
        }
    };

    const handleResetForm = () => {
        setEditingCurrency(null);
        setFormData({
            currency: '',
            currency_code: '',
        });
    };

    const handleSearch = () => {
        fetchCurrencies(search);
    };

    const handleResetSearch = () => {
        setSearch('');
        fetchCurrencies('');
    };

    const filteredCurrencies = currencies;

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Currency List</h1>
                    <span className="text-xs text-blue-100">Dashboard / CurrencyList</span>
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
                                {editingCurrency ? 'Edit Currency' : 'Add Currency'}
                            </h2>
                            {editingCurrency && (
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
                                <label className="block text-xs font-medium mb-1">Currency</label>
                                <input
                                    type="text"
                                    value={formData.currency}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            currency: e.target.value,
                                        }))
                                    }
                                    placeholder="Currency"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Currency Code</label>
                                <input
                                    type="text"
                                    value={formData.currency_code}
                                    onChange={e =>
                                        setFormData(prev => ({
                                            ...prev,
                                            currency_code: e.target.value,
                                        }))
                                    }
                                    placeholder="Currency Code"
                                    required
                                    className="w-full border rounded px-3 py-2 text-sm"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {editingCurrency ? 'Update' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-2 border border-gray-200 rounded p-4">
                        <h2 className="text-sm font-semibold mb-4">Currency List</h2>
                        {loading ? (
                            <div>Loading currencies...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                                No
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                                Currency
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                                Currency Code
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 border-b border-gray-200">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredCurrencies.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-4 py-4 text-center text-sm text-gray-500 border-b border-gray-100"
                                                >
                                                    No Currency Found
                                                </td>
                                            </tr>
                                        )}
                                        {filteredCurrencies.map((currency, index) => (
                                            <tr key={currency.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm border-b border-gray-100">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-2 text-sm border-b border-gray-100">
                                                    {currency.currency}
                                                </td>
                                                <td className="px-4 py-2 text-sm border-b border-gray-100">
                                                    {currency.currency_code}
                                                </td>
                                                <td className="px-4 py-2 text-sm border-b border-gray-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(currency)}
                                                        className="inline-flex items-center px-2 py-1 mr-2 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(currency.id)}
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

export default AdminCurrency;
