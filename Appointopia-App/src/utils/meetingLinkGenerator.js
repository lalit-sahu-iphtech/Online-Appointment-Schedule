// src/utils/meetingLinkGenerator.js

/**
 * Generate a Google Meet link
 * @param {string} meetingName - Name of the meeting
 * @param {string} date - Meeting date
 * @param {string} startTime - Meeting start time
 * @returns {string} - Google Meet link
 */
 export const generateGoogleMeetLink = (meetingName, date, startTime) => {
    // ✅ Google Meet create URL
    const baseUrl = 'https://meet.google.com/new';
    
    // ✅ Add meeting details as query params
    const params = new URLSearchParams();
    if (meetingName) params.append('meeting', meetingName);
    if (date) params.append('date', date);
    if (startTime) params.append('time', startTime);
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Generate a unique meeting ID (for display purposes)
 * @returns {string} - Unique meeting ID format: xxx-xxxx-xxx
 */
export const generateMeetingId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];
    
    const part1 = Array.from({ length: 3 }, getRandomChar).join('');
    const part2 = Array.from({ length: 4 }, getRandomChar).join('');
    const part3 = Array.from({ length: 3 }, getRandomChar).join('');
    
    return `${part1}-${part2}-${part3}`;
};

/**
 * Create a complete meeting link with display ID
 * @param {string} meetingName - Name of the meeting
 * @param {string} date - Meeting date
 * @param {string} startTime - Meeting start time
 * @returns {Object} - { link, displayId, fullLink, displayText }
 */
export const createMeetingLink = (meetingName, date, startTime) => {
    const displayId = generateMeetingId();
    const googleLink = generateGoogleMeetLink(meetingName, date, startTime);
    
    return {
        link: googleLink,
        displayId: displayId,
        fullLink: `https://meet.google.com/${displayId}`,
        displayText: `meet.google.com/${displayId}`
    };
};

/**
 * Validate if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Check if URL is a Google Meet link
 * @param {string} url - URL to check
 * @returns {boolean} - True if Google Meet link
 */
export const isGoogleMeetLink = (url) => {
    if (!url) return false;
    return url.includes('meet.google.com') || url.includes('meet.google.com/new');
};