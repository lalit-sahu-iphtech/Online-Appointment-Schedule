// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [allNotifications, setAllNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    // ✅ Add notifications from any source
    const addNotifications = useCallback((source, notifications) => {
        setAllNotifications(prev => {
            // Remove existing notifications from this source
            const filtered = prev.filter(n => n.source !== source);
            // Add new notifications with source label
            const newNotifications = notifications.map(n => ({
                ...n,
                source: source,
                sourceLabel: getSourceLabel(source),
            }));
            return [...filtered, ...newNotifications];
        });
    }, []);

    // ✅ Clear notifications from a source
    const clearNotifications = useCallback((source) => {
        setAllNotifications(prev => prev.filter(n => n.source !== source));
    }, []);

    // ✅ Get source label
    const getSourceLabel = (source) => {
        const labels = {
            calendar: "📅 Calendar",
            schedule: "📋 Schedule",
            workflows: "⚙️ Workflow",
        };
        return labels[source] || source;
    };

    // ✅ Update count
    useEffect(() => {
        setNotificationCount(allNotifications.length);
    }, [allNotifications]);

    // ✅ Sort by time (nearest first)
    const sortedNotifications = [...allNotifications].sort((a, b) => {
        return (a.diffMinutes || 0) - (b.diffMinutes || 0);
    });

    const value = {
        notifications: sortedNotifications,
        count: notificationCount,
        addNotifications,
        clearNotifications,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationsContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationsContext must be used within NotificationProvider');
    }
    return context;
}