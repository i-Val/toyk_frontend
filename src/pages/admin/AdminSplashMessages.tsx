import { useEffect, useState, type FormEvent } from 'react';
import api from '../../api/axios';

type SplashColor = 'red' | 'blue' | '';

type SplashForm = {
    web_message: string;
    web_link: string;
    app_message: string;
    messgae_bg_color: SplashColor;
};

const initialForm: SplashForm = {
    web_message: '',
    web_link: '',
    app_message: '',
    messgae_bg_color: '',
};

const AdminSplashMessages = () => {
    const [form, setForm] = useState<SplashForm>(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchSplash = async () => {
            setLoading(true);
            setErrorMessage(null);
            try {
                const res = await api.get('/admin/splash_messages');
                if (res.data?.status && res.data?.data) {
                    const data = res.data.data;
                    setForm({
                        web_message: data.web_message || '',
                        web_link: data.web_link || '',
                        app_message: data.app_message || '',
                        messgae_bg_color: (data.messgae_bg_color as SplashColor) || '',
                    });
                }
            } catch (error) {
                let message = 'Failed to load splash messages.';
                if (
                    typeof error === 'object' &&
                    error !== null &&
                    'response' in error &&
                    (error as { response?: { data?: { message?: string; error?: string } } }).response
                ) {
                    const res = (error as { response?: { data?: { message?: string; error?: string } } })
                        .response;
                    message = res?.data?.message || res?.data?.error || message;
                }
                setErrorMessage(message);
            } finally {
                setLoading(false);
            }
        };

        fetchSplash();
    }, []);

    const handleChange =
        (field: keyof SplashForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const value = e.target.value;
            if (field === 'app_message' && value.length > 241) {
                return;
            }
            setForm(prev => ({
                ...prev,
                [field]: value,
            }));
        };

    const handleColorChange = (color: SplashColor) => {
        setForm(prev => ({
            ...prev,
            messgae_bg_color: color,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        setErrorMessage(null);

        if (form.app_message.length > 241) {
            setErrorMessage('App message must be at most 241 characters.');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                web_message: form.web_message || null,
                web_link: form.web_link || null,
                app_message: form.app_message || null,
                messgae_bg_color: form.messgae_bg_color || null,
            };

            const res = await api.post('/admin/splash_messages', payload);

            setStatusMessage(res.data?.msg || 'Splash messages updated successfully.');
        } catch (error) {
            let message = 'Failed to save splash messages.';
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (error as { response?: { data?: { message?: string; error?: string } } }).response
            ) {
                const res = (error as { response?: { data?: { message?: string; error?: string } } })
                    .response;
                message = res?.data?.message || res?.data?.error || message;
            }
            setErrorMessage(message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Manage Splash Messages</h1>
                    <span className="text-xs text-blue-100">Dashboard / Splash Messages</span>
                </div>
            </div>
            <div className="p-6 max-w-3xl">
                {loading ? (
                    <div className="text-sm text-gray-600">Loading current splash messages...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Web Message</label>
                            <textarea
                                value={form.web_message}
                                onChange={handleChange('web_message')}
                                className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
                                placeholder="Web Message"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Web Link</label>
                            <input
                                type="text"
                                value={form.web_link}
                                onChange={handleChange('web_link')}
                                className="w-full border rounded px-3 py-2 text-sm"
                                placeholder="Web Link"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                App Message{' '}
                                <span className="text-xs text-gray-500">
                                    ({form.app_message.length}/241)
                                </span>
                            </label>
                            <textarea
                                value={form.app_message}
                                onChange={handleChange('app_message')}
                                className="w-full border rounded px-3 py-2 text-sm min-h-[120px]"
                                placeholder="App Message"
                                maxLength={241}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Splash Message Background Color
                            </label>
                            <div className="flex items-center gap-6 text-sm">
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="messgae_bg_color"
                                        value="red"
                                        checked={form.messgae_bg_color === 'red'}
                                        onChange={() => handleColorChange('red')}
                                    />
                                    <span>Red</span>
                                </label>
                                <label className="inline-flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="messgae_bg_color"
                                        value="blue"
                                        checked={form.messgae_bg_color === 'blue'}
                                        onChange={() => handleColorChange('blue')}
                                    />
                                    <span>Blue</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            {statusMessage && (
                                <span className="text-sm text-green-600">{statusMessage}</span>
                            )}
                            {errorMessage && (
                                <span className="text-sm text-red-600">{errorMessage}</span>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AdminSplashMessages;
