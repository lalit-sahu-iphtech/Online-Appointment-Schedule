// src/utils/colorUtils.js

// Pre-defined color palette
const EVENT_COLORS = [
    { id: 'purple', bg: '#8755D5', text: '#ffffff', light: '#F4EFFF' },
    { id: 'teal', bg: '#16A6AD', text: '#ffffff', light: '#E5F8FA' },
    { id: 'orange', bg: '#FF7800', text: '#ffffff', light: '#FFF0E0' },
    { id: 'blue', bg: '#2F80D7', text: '#ffffff', light: '#E5F0FF' },
    { id: 'pink', bg: '#E84C8A', text: '#ffffff', light: '#FFE5F0' },
    { id: 'green', bg: '#27AE60', text: '#ffffff', light: '#E5F9E5' },
    { id: 'red', bg: '#E74C3C', text: '#ffffff', light: '#FFE5E5' },
    { id: 'yellow', bg: '#F2C94C', text: '#1a1a1a', light: '#FFF8E5' },
    { id: 'indigo', bg: '#4A56E2', text: '#ffffff', light: '#E8EAFF' },
    { id: 'brown', bg: '#8B5E3C', text: '#ffffff', light: '#F5EDE5' },
  ];
  
  // Store used colors to avoid repetition
  let colorUsageCount = {};
  
  // Get random color for an event
  export const getRandomEventColor = (eventId) => {
    // If event already has a color, return it
    const savedColor = localStorage.getItem(`event_color_${eventId}`);
    if (savedColor) {
      return JSON.parse(savedColor);
    }
  
    // Find least used color
    const colorCounts = EVENT_COLORS.map(color => ({
      ...color,
      count: colorUsageCount[color.id] || 0
    }));
  
    // Sort by count (ascending)
    colorCounts.sort((a, b) => a.count - b.count);
  
    // Pick the least used color
    const selectedColor = colorCounts[0];
  
    // Update usage count
    colorUsageCount[selectedColor.id] = (colorUsageCount[selectedColor.id] || 0) + 1;
  
    // Save to localStorage
    localStorage.setItem(`event_color_${eventId}`, JSON.stringify(selectedColor));
  
    return selectedColor;
  };
  
  // Get color by ID (for existing events)
  export const getColorById = (colorId) => {
    return EVENT_COLORS.find(c => c.id === colorId) || EVENT_COLORS[0];
  };
  
  // Get color for an event (if saved, use saved; else generate new)
  export const getEventColor = (eventId, existingColorId) => {
    if (existingColorId) {
      return getColorById(existingColorId);
    }
    return getRandomEventColor(eventId);
  };
  
  // Reset color usage (call when needed)
  export const resetColorUsage = () => {
    colorUsageCount = {};
    // Optionally clear saved colors from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('event_color_')) {
        localStorage.removeItem(key);
      }
    });
  };