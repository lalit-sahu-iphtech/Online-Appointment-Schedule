// src/pages/CalendarPage.jsx
import { useState, useEffect } from "react";
import Calendar from "../../component/Calendar/Calendar";
import Sidebar from "../../component/Sidebar/Sidebar";

import "./calendarPage.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load events from localStorage initially
  useEffect(() => {
    const saved = localStorage.getItem('calendar_meetings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setEvents(parsed);
        console.log("📂 Loaded events from localStorage:", parsed);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }
  }, []);

  // This function will be called from Calendar component
  const handleEventsChange = (newEvents) => {
    console.log("📤 Events changed in Calendar:", newEvents);
    setEvents(newEvents);
  };

  // Update selected date when calendar changes
  const handleDateChange = (date) => {
    console.log("📅 Date changed in Calendar:", date);
    setSelectedDate(date);
  };

  return (
    <div className="calendar-page">
      <Sidebar 
        events={events} 
        selectedDate={selectedDate} 
      />

      <div className="calendar-main">
        <main className="calendar-content">
          <Calendar 
            onEventsChange={handleEventsChange}
            onDateChange={handleDateChange}
          />
        </main>
      </div>
    </div>
  );
}