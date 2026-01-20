import { useState, useEffect, type FormEvent } from 'react';
import api from '../../api/axios';

type NotificationType = 'email' | 'sms';

const AdminNotify = () => {
    const [notificationType, setNotificationType] = useState<NotificationType>('email');
    const [sending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const anyWindow = window as any;

        const initializeEditor = () => {
            if (!isMounted) {
                return;
            }

            const editor = anyWindow.CKEDITOR?.instances?.['admin-notify-editor'];
            if (editor) {
                editor.destroy(true);
            }

            if (anyWindow.CKEDITOR) {
                anyWindow.CKEDITOR.replace('admin-notify-editor');
            }
        };

        const existingScript = document.querySelector<HTMLScriptElement>('script[data-ckeditor="1"]');

        if (existingScript) {
            if (anyWindow.CKEDITOR) {
                initializeEditor();
            } else {
                existingScript.addEventListener('load', initializeEditor);
            }
        } else {
            const script = document.createElement('script');
            script.src = 'https://cdn.ckeditor.com/4.25.0-lts/standard/ckeditor.js';
            script.async = true;
            script.dataset.ckeditor = '1';
            script.addEventListener('load', initializeEditor);
            document.body.appendChild(script);
        }

        return () => {
            isMounted = false;
            const editor = anyWindow.CKEDITOR?.instances?.['admin-notify-editor'];
            if (editor) {
                editor.destroy(true);
            }
        };
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        setErrorMessage(null);

        const anyWindow = window as any;
        const editor = anyWindow.CKEDITOR?.instances?.['admin-notify-editor'];
        const textarea = document.getElementById('admin-notify-editor') as HTMLTextAreaElement | null;

        let content: string = '';

        if (editor) {
            content = editor.getData();
        } else if (textarea) {
            content = textarea.value;
        }

        const plainText = content
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .trim();

        if (!plainText) {
            setErrorMessage('Please enter a notification message.');
            return;
        }

        setSending(true);

        try {
            const res = await api.post('/admin/notify', {
                notification_type: notificationType,
                notification: content,
            });

            setStatusMessage(res.data?.message || 'Notification sent successfully.');
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Failed to send notification.';
            setErrorMessage(message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded shadow-sm">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t">
                <div>
                    <h1 className="text-xl font-medium">Send Notifications</h1>
                    <span className="text-xs text-blue-100">Dashboard / Notify</span>
                </div>
            </div>
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium mb-2">Message</label>
                        <textarea
                            id="admin-notify-editor"
                            className="w-full border rounded px-3 py-2 text-sm min-h-[260px]"
                            placeholder="Notification Message"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Notification Type</label>
                        <div className="flex items-center gap-6 text-sm">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="notification_type"
                                    value="email"
                                    checked={notificationType === 'email'}
                                    onChange={() => setNotificationType('email')}
                                />
                                <span>Email</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="notification_type"
                                    value="sms"
                                    checked={notificationType === 'sms'}
                                    onChange={() => setNotificationType('sms')}
                                />
                                <span>Sms</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={sending}
                            className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
                        >
                            {sending ? 'Sending...' : 'Send'}
                        </button>
                        {statusMessage && (
                            <span className="text-sm text-green-600">{statusMessage}</span>
                        )}
                        {errorMessage && (
                            <span className="text-sm text-red-600">{errorMessage}</span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminNotify;
