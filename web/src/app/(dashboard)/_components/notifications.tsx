import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Notification = {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'success' | 'error' | 'info';
};

type NotificationContextType = {
    addNotification: (notification: Partial<Notification>) => void;
    removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Partial<Notification>) => {
        const id = Date.now().toString();
        setNotifications((prev) => [
            ...prev,
            {
                id,
                title: notification.title || 'Notification',
                description: notification.description,
                variant: notification.variant || 'default',
            },
        ]);
        // Auto-dismiss after 5 seconds
        setTimeout(() => removeNotification(id), 5000);
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification, removeNotification }}>
            {children}
            <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
                <AnimatePresence>
                    {notifications.map((notification) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className={`w-80 p-4 rounded shadow-lg border 
                                ${notification.variant === 'success' ? 'bg-green-50 border-green-200' : ''}
                                ${notification.variant === 'error' ? 'bg-red-50 border-red-200' : ''}
                                ${notification.variant === 'info' ? 'bg-blue-50 border-blue-200' : ''}
                                ${notification.variant === 'default' ? 'bg-zinc-50 border-zinc-200' : ''}
                            `}
                        >
                            {notification.title && (
                                <div className="font-semibold text-zinc-800">
                                    {notification.title}
                                </div>
                            )}
                            {notification.description && (
                                <div className="mt-1 text-sm text-zinc-600">
                                    {notification.description}
                                </div>
                            )}
                            <button
                                aria-label="Dismiss"
                                className="mt-2 text-xs text-zinc-500 hover:underline"
                                onClick={() => removeNotification(notification.id)}
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};

// Example component to trigger notifications (for testing)
export const DemoNotifications: React.FC = () => {
    const { addNotification } = useNotifications();

    const handleAdd = () => {
        addNotification({
            title: 'Evee Notification',
            description: 'This is a sample notification using shadcn styling and zinc colors.',
            variant: 'default',
        });
    };

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 font-medium rounded bg-zinc-600 text-white hover:bg-zinc-700 transition"
            >
                Show Notification
            </button>
        </div>
    );
};