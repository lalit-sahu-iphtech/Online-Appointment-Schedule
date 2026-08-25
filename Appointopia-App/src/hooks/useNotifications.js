// src/hooks/useNotifications.js
import { useState, useEffect, useRef } from "react";
import { getUpcomingNotifications, getNotificationLabel } from "../utils/notificationService";

export function useNotifications(events, windowMinutes = 60) {
    const [notifications, setNotifications] = useState([]);
    const [now, setNow] = useState(new Date());
    
    // ✅ Use refs to track previous values
    const prevEventsRef = useRef(events);
    const prevWindowRef = useRef(windowMinutes);

    // Update time every 30 seconds
    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(timer);
    }, []);

    // ✅ Calculate notifications only when needed
    useEffect(() => {
        // ✅ Check if events or windowMinutes actually changed
        const eventsChanged = prevEventsRef.current !== events;
        const windowChanged = prevWindowRef.current !== windowMinutes;
        
        // ✅ If nothing changed, skip
        if (!eventsChanged && !windowChanged) {
            return;
        }
        
        // ✅ Update refs
        prevEventsRef.current = events;
        prevWindowRef.current = windowMinutes;
        
        // ✅ Calculate new notifications
        const newNotifications = getUpcomingNotifications(events, windowMinutes);
        setNotifications(newNotifications);
        
    }, [events, windowMinutes]);

    // Get label for a notification
    const getLabel = (diffMinutes) => {
        return getNotificationLabel(diffMinutes);
    };

    // Check if there are any notifications
    const hasNotifications = notifications.length > 0;

    // Get notification count
    const count = notifications.length;

    return {
        notifications,
        hasNotifications,
        count,
        getLabel,
        refresh: () => setNow(new Date()),
    };
}