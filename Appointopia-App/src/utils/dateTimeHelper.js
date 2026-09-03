
//  FIXED: Changed from 'formateDateToYYYYMMDD' to 'formatDateToYYYYMMDD'
export const formatDateToYYYYMMDD = (date) => {
    if(!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format time from "08:00" to "8:00 AM" or "08:00 AM"
export const formatTimeDisplay = (timeStr) => {
    if(!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM':'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

// Convert time string to minutes (for comparison)
// "08:00" -> 480, "14:30" -> 870
export const timeToMinutes = (timeStr) => {
    if(!timeStr) return 0; 
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Get current time in minutes
export const getCurrentTimeInMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

// Check if event is today
export const isEventToday = (eventDate, selectedDate) => {
    const eventDateStr = formatDateToYYYYMMDD(new Date(eventDate));
    const selectedDateStr = formatDateToYYYYMMDD(new Date(selectedDate));
    return eventDateStr === selectedDateStr;
}

// Sort events by start time
export const sortEventsByTime = (events) => {
    if (!events || !Array.isArray(events)) return [];
    return [...events].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return a.startTime.localeCompare(b.startTime);
    });
}

// Format date for display (eg, "Tue, Jul 18")
export const formatDateDisplay = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}