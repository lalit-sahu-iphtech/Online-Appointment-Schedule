// src/utils/notificationService.js

/**
 * Get upcoming notifications from events
 * @param {Array} events - Array of events/appointments
 * @param {Number} windowMinutes - Time window in minutes (default: 60)
 * @returns {Array} - Sorted notifications with diffMinutes
 */
// src/utils/notificationService.js

export const getUpcomingNotifications = (events, windowMinutes = 60) => {
    const now = new Date();
    const notifications = [];

    console.log("📢 getUpcomingNotifications called with", events?.length || 0, "events");

    if (!events || events.length === 0) {
        console.log("📢 No events provided");
        return notifications;
    }

    events.forEach((event) => {
        // ✅ Debug: Log each event
        console.log(`📢 Event:`, {
            name: event.meetingName || event.title,
            date: event.date,
            startTime: event.startTime,
        });

        // ✅ Check if event has date and startTime
        if (!event.date || !event.startTime) {
            console.log(`⚠️ Event missing date or startTime — skipping`);
            return;
        }

        // ✅ Parse event date
        const [year, month, day] = event.date.split("-").map(Number);
        const [hours, minutes] = event.startTime.split(":").map(Number);
        
        // ✅ Create proper event date object
        const eventDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
        
        if (isNaN(eventDate.getTime())) {
            console.log(`⚠️ Invalid event date — skipping`);
            return;
        }

        const diffMinutes = (eventDate - now) / 60000;
        console.log(`⏱️ Diff minutes: ${diffMinutes.toFixed(2)}`);

        // ✅ Show events from 10 minutes before to windowMinutes after
        if (diffMinutes >= -10 && diffMinutes <= windowMinutes) {
            console.log(`✅ Notification found!`);
            notifications.push({
                id: event.id,
                title: event.title || event.meetingName || event.name,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
                location: event.location,
                onlineLink: event.onlineLink,
                diffMinutes: diffMinutes,
                event: event,
            });
        } else {
            console.log(`⏭️ Outside time window (${diffMinutes.toFixed(2)} mins)`);
        }
    });

    console.log(`📢 Total notifications found: ${notifications.length}`);
    return notifications.sort((a, b) => a.diffMinutes - b.diffMinutes);
};


/**
 * Get notification label based on time difference
 * @param {Number} diffMinutes - Difference in minutes
 * @returns {String} - Human readable label
 */
export const getNotificationLabel = (diffMinutes) => {
    if (diffMinutes === undefined || diffMinutes === null) return "Now";
    
    const absMinutes = Math.round(Math.abs(diffMinutes));
    
    if (diffMinutes <= 0) {
        if (absMinutes === 0) return "🔥 Now";
        if (absMinutes < 60) return `⏰ ${absMinutes}m ago`;
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        if (mins === 0) return `⏰ ${hours}h ago`;
        return `⏰ ${hours}h ${mins}m ago`;
    } else {
        if (absMinutes < 60) return `⏳ In ${absMinutes}m`;
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        if (mins === 0) return `⏳ In ${hours}h`;
        return `⏳ In ${hours}h ${mins}m`;
    }
};

/**
 * Check if any upcoming notifications exist
 * @param {Array} events - Array of events
 * @param {Number} windowMinutes - Time window
 * @returns {Boolean}
 */
export const hasUpcomingNotifications = (events, windowMinutes = 60) => {
    const notifications = getUpcomingNotifications(events, windowMinutes);
    return notifications.length > 0;
};

/**
 * Get count of upcoming notifications
 * @param {Array} events - Array of events
 * @param {Number} windowMinutes - Time window
 * @returns {Number}
 */
export const getUpcomingNotificationCount = (events, windowMinutes = 60) => {
    const notifications = getUpcomingNotifications(events, windowMinutes);
    return notifications.length;
};