import { 
    formatDateToYYYYMMDD,
    timeToMinutes,
    getCurrentTimeInMinutes, 
    sortEventsByTime,
} from "./dateTimeHelper";

export const getNextEvent = (events, selectedDate) => {
    //  GUARD CLAUSE: Check if events is valid
    if (!events || !Array.isArray(events) || events.length === 0) {
        return null;
    }

    //  GUARD CLAUSE: Check if selectedDate is valid
    if (!selectedDate) {
        return null;
    }

    // Normalize selected date
    const selectedDateStr = formatDateToYYYYMMDD(new Date(selectedDate));

    // Filter events for selected date only
    const todaysEvents = events.filter(event => {
        if (!event.date) return false;
        const eventDateStr = formatDateToYYYYMMDD(new Date(event.date));
        return eventDateStr === selectedDateStr;
    });

    // If no events today, return null
    if (todaysEvents.length === 0) {
        return null;
    }

    // Sort events by start time (earliest first)
    const sortedEvents = sortEventsByTime(todaysEvents);

    // Get current time in minutes
    const currentTimeMinutes = getCurrentTimeInMinutes();

    // Find next event (after current time)
    const nextEvent = sortedEvents.find(event => {
        if (!event.startTime) return false;
        const eventTimeMinutes = timeToMinutes(event.startTime);
        return eventTimeMinutes > currentTimeMinutes;
    });

    // If all events passed, return null (no more events today)
    return nextEvent || null;
};