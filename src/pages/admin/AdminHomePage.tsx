import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast, usePageLoader } from '../../components/UiFeedbackProvider';

interface Category {
    id: number;
    name: string;
}

interface HomeSettings {
    featured_enabled: boolean;
    allow_sms_enabled: boolean;
    top_categories: string[];
    nav_categories: string[];
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    android_version: string;
    ios_version: string;
}

const AdminHomePage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const { showToast } = useToast();
    const { startLoading, stopLoading } = usePageLoader();
    
    // State matching the screenshot structure
    const [settings, setSettings] = useState<HomeSettings>({
        featured_enabled: true,
        allow_sms_enabled: true,
        top_categories: [],
        nav_categories: [],
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        linkedin: '',
        android_version: '',
        ios_version: ''
    });

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

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, categoriesRes] = await Promise.all([
                    api.get('/admin/home_settings'),
                    api.get('/admin/get_all_categories')
                ]);

                if (categoriesRes.data.status) {
                    setAvailableCategories(categoriesRes.data.data);
                }

                if (settingsRes.data.status && settingsRes.data.data) {
                    setSettings(settingsRes.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleToggle = (key: 'featured_enabled' | 'allow_sms_enabled') => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleAddCategory = (type: 'top_categories' | 'nav_categories', categoryName: string) => {
        if (!categoryName) return;
        if (settings[type].includes(categoryName)) return;
        
        if (type === 'nav_categories' && settings.nav_categories.length >= 8) {
            showToast('You can select maximum 8 categories for Nav Categories.', 'error');
            return;
        }

        setSettings(prev => ({
            ...prev,
            [type]: [...prev[type], categoryName]
        }));
    };

    const handleRemoveCategory = (type: 'top_categories' | 'nav_categories', categoryName: string) => {
        setSettings(prev => ({
            ...prev,
            [type]: prev[type].filter(c => c !== categoryName)
        }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const res = await api.post('/admin/home_settings', settings);
            if (res.data.status) {
                showToast('Settings updated successfully');
            } else {
                showToast('Failed to update settings: ' + res.data.msg, 'error');
            }
        } catch (error) {
            console.error("Failed to update settings", error);
            showToast('Failed to update settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="bg-white rounded shadow-sm">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div className="flex items-center">
                    <span className="text-xl font-medium">Manage Home Page</span>
                </div>
                <button className="text-white">
                    <i className="fa fa-chevron-down"></i>
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* Toggles Section */}
                <div>
                    <div className="mb-6">
                        <label className="block font-semibold mb-2 text-gray-700">Featured</label>
                        <div className="flex items-center mb-2">
                            <button 
                                onClick={() => handleToggle('featured_enabled')}
                                className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${settings.featured_enabled ? 'bg-red-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.featured_enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                            <span className="ml-3 font-bold text-sm text-gray-700">{settings.featured_enabled ? 'ON' : 'OFF'}</span>
                        </div>
                        <p className="text-xs text-gray-500">Note: When the featured toggle is on then Free ads as well as Featured ads can be posted for the frontend and When toggle is off then only Paid ads can be posted from frontend</p>
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold mb-2 text-gray-700">Allow SMS</label>
                        <div className="flex items-center mb-2">
                            <button 
                                onClick={() => handleToggle('allow_sms_enabled')}
                                className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out relative ${settings.allow_sms_enabled ? 'bg-red-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${settings.allow_sms_enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </button>
                            <span className="ml-3 font-bold text-sm text-gray-700">{settings.allow_sms_enabled ? 'ON' : 'OFF'}</span>
                        </div>
                        <p className="text-xs text-gray-500">Note: When this Toggle is on then users will receive SMS for ads view. When this toggle is off then users will not receive SMS for ads view.</p>
                    </div>
                </div>

                {/* Categories Section */}
                <div>
                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Top Categories</label>
                        <div className="flex gap-2 mb-2">
                            <select 
                                className="border p-2 rounded w-full md:w-1/2 focus:outline-none focus:border-blue-500"
                                onChange={(e) => {
                                    handleAddCategory('top_categories', e.target.value);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Select Category to Add...</option>
                                {availableCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50 min-h-[50px]">
                            {settings.top_categories.map((cat, idx) => (
                                <div key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300 flex items-center">
                                    <span>{cat}</span>
                                    <button 
                                        onClick={() => handleRemoveCategory('top_categories', cat)}
                                        className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            {settings.top_categories.length === 0 && (
                                <span className="text-gray-400 italic p-1">No categories selected</span>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Nav Categories</label>
                        <div className="flex gap-2 mb-2">
                            <select 
                                className="border p-2 rounded w-full md:w-1/2 focus:outline-none focus:border-blue-500"
                                onChange={(e) => {
                                    handleAddCategory('nav_categories', e.target.value);
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Select Category to Add...</option>
                                {availableCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-wrap gap-2 border p-2 rounded bg-gray-50 min-h-[50px]">
                            {settings.nav_categories.map((cat, idx) => (
                                <div key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-300 flex items-center">
                                    <span>{cat}</span>
                                    <button 
                                        onClick={() => handleRemoveCategory('nav_categories', cat)}
                                        className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                                    >
                                        <i className="fa fa-times"></i>
                                    </button>
                                </div>
                            ))}
                            {settings.nav_categories.length === 0 && (
                                <span className="text-gray-400 italic p-1">No categories selected</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Note - You can select maximum 8 categories.</p>
                    </div>
                </div>

                {/* Contact Info Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Manage Contact Info</h3>
                    
                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Email</label>
                        <input 
                            type="text" 
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Note - For Multiple Emails - Enter comma(,) separated emails like ( abc@gmail.com,dummy@mgail.com )</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone"
                            value={settings.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Note - For Multiple Phone numbers - Enter comma(,) separated Phone numbers like ( 123456789,9876543210 )</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Phone Number (WhatsApp)</label>
                        <input 
                            type="text" 
                            name="whatsapp"
                            value={settings.whatsapp}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Note - For Multiple Phone numbers - Enter comma(,) separated Phone numbers like ( 123456789,9876543210 )</p>
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Address</label>
                        <textarea 
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            rows={4}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Social Links Section */}
                <div>
                    <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Manage Social Links</h3>
                    
                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Facebook</label>
                        <input 
                            type="text" 
                            name="facebook"
                            value={settings.facebook}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Twitter</label>
                        <input 
                            type="text" 
                            name="twitter"
                            value={settings.twitter}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Instagram</label>
                        <input 
                            type="text" 
                            name="instagram"
                            value={settings.instagram}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">YouTube</label>
                        <input 
                            type="text" 
                            name="youtube"
                            value={settings.youtube}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Linkedin</label>
                        <input 
                            type="text" 
                            name="linkedin"
                            value={settings.linkedin}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">Android Version</label>
                        <input 
                            type="text" 
                            name="android_version"
                            value={settings.android_version}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold mb-2 text-gray-700">iOS Version</label>
                        <input 
                            type="text" 
                            name="ios_version"
                            value={settings.ios_version}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4">
                    <button 
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors duration-200"
                    >
                        {saving ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
