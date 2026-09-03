// src/component/Calendar/Reminder.jsx
import { useState, useEffect } from "react";
import { FaBell, FaVideo, FaTimes, FaClock } from "react-icons/fa";
import "./Reminder.css";
import { useToast } from "../Toast";

// ✅ Helper function to get user settings
const getUserSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem("app_settings"));
    return settings || {};
  } catch {
    return {};
  }
};

export default function Reminder({ events = [], onJoinMeeting, onDismiss }) {
  const toast = useToast();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Har 30 second mein time update karo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Check upcoming events (next 60 minutes) - WITH SETTINGS CHECK
  useEffect(() => {
    // ✅ Get user settings
    const userSettings = getUserSettings();
    const meetingRemindersEnabled = userSettings.meetingReminders !== false;

    // ✅ If meeting reminders are disabled, don't show any reminders
    if (!meetingRemindersEnabled) {
      console.log("⏭️ Meeting reminders disabled in settings, hiding reminder cards");
      setUpcomingEvents([]);
      return;
    }

    const now = new Date();
    const upcoming = events
      .map((event) => {
        if (!event.date || !event.startTime) return null;
        
        const [year, month, day] = event.date.split("-").map(Number);
        const [hours, minutes] = event.startTime.split(":").map(Number);
        const eventStart = new Date(year, month - 1, day, hours, minutes, 0);
        
        const diffMinutes = (eventStart - now) / 60000;
        
        return {
          ...event,
          eventStart,
          diffMinutes,
          isActive: diffMinutes >= -10 && diffMinutes <= 5,
          isSoon: diffMinutes > 0 && diffMinutes <= 60,
        };
      })
      .filter((event) => event && (event.isActive || event.isSoon))
      .sort((a, b) => a.diffMinutes - b.diffMinutes);

    setUpcomingEvents(upcoming);
  }, [events, currentTime]);

  const handleDismiss = (eventId) => {
    setUpcomingEvents((prev) => prev.filter((e) => e.id !== eventId));
    if (onDismiss) {
      onDismiss(eventId);
    }
    toast.info(' Reminder Dismissed', 'You have dismissed this reminder.');
  };

  const handleJoin = (event) => {
    if (onJoinMeeting) {
      onJoinMeeting(event);
    }
    if (event.onlineLink) {
      window.open(event.onlineLink, "_blank");
      toast.info(' Joining Meeting', `Opening ${event.meetingName}...`);
    } else {
      toast.warning('⚠️ No Link', 'This meeting does not have an online link.');
    }
  };

  const getTimeLabel = (diffMinutes) => {
    if (diffMinutes <= 0) {
      const mins = Math.round(Math.abs(diffMinutes));
      return mins === 0 ? "Now" : `${mins}m ago`;
    }
    const mins = Math.round(diffMinutes);
    if (mins < 60) {
      return `In ${mins}m`;
    }
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return remainingMins === 0 
      ? `In ${hours}h` 
      : `In ${hours}h ${remainingMins}m`;
  };

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <div className="reminder-container">
      {upcomingEvents.slice(0, 3).map((event) => (
        <div 
          key={event.id} 
          className={`reminder-card ${event.diffMinutes <= 0 ? "active" : ""}`}
        >
          <div className="reminder-header">
            <div className="reminder-title">
              <FaBell className="reminder-icon" />
              <span className="reminder-name">{event.meetingName}</span>
            </div>
            <button 
              className="reminder-dismiss" 
              onClick={() => handleDismiss(event.id)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="reminder-body">
            <div className="reminder-time">
              <FaClock className="time-icon" />
              <span className="time-label">
                {getTimeLabel(event.diffMinutes)}
              </span>
              <span className="time-detail">
                {event.startTime} - {event.endTime}
              </span>
            </div>

            {event.location && (
              <div className="reminder-location">
                 {event.location}
              </div>
            )}

            {event.diffMinutes <= 0 && event.diffMinutes >= -5 && (
              <div className="reminder-urgency">
                 Meeting in progress
              </div>
            )}
          </div>

          <div className="reminder-footer">
            <button 
              className="reminder-join-btn" 
              onClick={() => handleJoin(event)}
            >
              <FaVideo /> Join Online
            </button>
            <button 
              className="reminder-snooze-btn"
              onClick={() => handleDismiss(event.id)}
            >
              Snooze
            </button>
          </div>
        </div>
      ))}

      {upcomingEvents.length > 3 && (
        <div className="reminder-more">
          +{upcomingEvents.length - 3} more meetings
        </div>
      )}
    </div>
  );
}