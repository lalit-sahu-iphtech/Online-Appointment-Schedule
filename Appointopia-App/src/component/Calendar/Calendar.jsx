import { useState, useEffect } from "react";
import {
  FaSearch,
  FaRegBell,
  FaRegCommentDots,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

import AddMeetingModal from "./AddMeetingModal";
import "./calendar.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EventDetailsModal from "./EventDetailsModal";
import { getRandomEventColor } from "../../utils/colorUtils";

import {
  getWeekDays,
  formatDate,
  getDayDate,
  getMonthYear,
} from "../../utils/dateUtils";

export default function Calendar() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("day");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meeting, setMeeting] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('calendar_meetings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure each event has a color
      const withColors = parsed.map(event => {
        if (!event.color) {
          const color = getRandomEventColor(event.id);
          return { ...event, color: color.id };
        }
        return event;
      });
      setMeeting(withColors);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('calendar_meetings', JSON.stringify(meeting));
  }, [meeting]);

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getHeaderText = () => {
    if (view === 'day') {
      return getDayDate(currentDate);
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      const startMonth = start.toLocaleString('default', { month: 'short' });
      const endMonth = end.toLocaleString('default', { month: 'short' });
      const year = start.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
      } else {
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
      }
    } else {
      return getMonthYear(currentDate);
    }
  };

  const deleteMeeting = (id) => {
    setMeeting(meeting.filter(item => item.id !== id));
    // Remove color from localStorage
    localStorage.removeItem(`event_color_${id}`);
  };

  const getEventPosition = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const calendarStartHour = 7;
    const startMinutes = startHour * 60 + startMinute - calendarStartHour * 60;
    const endMinutes = endHour * 60 + endMinute - calendarStartHour * 60;
    const top = (startMinutes / 60) * 58;
    const height = ((endMinutes - startMinutes) / 60) * 58;
    return { top, height };
  };

  // Get color for an event
  const getEventColor = (event) => {
    if (event.color) {
      // If color exists, use it
      const colors = {
        purple: { bg: '#8755D5', text: '#ffffff' },
        teal: { bg: '#16A6AD', text: '#ffffff' },
        orange: { bg: '#FF7800', text: '#ffffff' },
        blue: { bg: '#2F80D7', text: '#ffffff' },
        pink: { bg: '#E84C8A', text: '#ffffff' },
        green: { bg: '#27AE60', text: '#ffffff' },
        red: { bg: '#E74C3C', text: '#ffffff' },
        yellow: { bg: '#F2C94C', text: '#1a1a1a' },
        indigo: { bg: '#4A56E2', text: '#ffffff' },
        brown: { bg: '#8B5E3C', text: '#ffffff' },
      };
      return colors[event.color] || colors.purple;
    }
    // Generate new color
    const color = getRandomEventColor(event.id);
    // Save color to event
    const updatedMeeting = meeting.map(m => 
      m.id === event.id ? { ...m, color: color.id } : m
    );
    setMeeting(updatedMeeting);
    const colors = {
      purple: { bg: '#8755D5', text: '#ffffff' },
      teal: { bg: '#16A6AD', text: '#ffffff' },
      orange: { bg: '#FF7800', text: '#ffffff' },
      blue: { bg: '#2F80D7', text: '#ffffff' },
      pink: { bg: '#E84C8A', text: '#ffffff' },
      green: { bg: '#27AE60', text: '#ffffff' },
      red: { bg: '#E74C3C', text: '#ffffff' },
      yellow: { bg: '#F2C94C', text: '#1a1a1a' },
      indigo: { bg: '#4A56E2', text: '#ffffff' },
      brown: { bg: '#8B5E3C', text: '#ffffff' },
    };
    return colors[color.id] || colors.purple;
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="calendar-topbar">
        <h1>Calendar</h1>
        <div className="topbar-right">
          <button className="create-btn" onClick={() => setShowMeetingModal(true)}>
            <span>+</span> Create
          </button>
          <div className="topbar-icons">
            <button className="icon-btn"><FaSearch /></button>
            <button className="icon-btn"><FaRegBell /></button>
            <button className="icon-btn"><FaRegCommentDots /></button>
            <div className="avatar-wrap">
              <FaUserCircle className="avatar-icon" />
              <FaChevronDown className="avatar-chevron" />
            </div>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-date">
            <h2>{getHeaderText()}</h2>
            <button className="arrow-btn" onClick={goToPrevious}>‹</button>
            <button className="arrow-btn" onClick={goToNext}>›</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
          <div className="calendar-view">
            <button className={view === "day" ? "view-active" : ""} onClick={() => setView("day")}>Day</button>
            <button className={view === "week" ? "view-active" : ""} onClick={() => setView("week")}>Week</button>
            <button className={view === "month" ? "view-active" : ""} onClick={() => setView("month")}>Month</button>
          </div>
        </div>

        {view === "day" && (
          <DayView
            meeting={meeting}
            getEventPosition={getEventPosition}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={deleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "week" && (
          <WeekView
            meeting={meeting}
            getEventPosition={getEventPosition}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={deleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "month" && (
          <MonthView
            meeting={meeting}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={deleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}
      </div>

      {showMeetingModal && (
        <AddMeetingModal
          onClose={() => setShowMeetingModal(false)}
          defaultDate={formatDate(currentDate)}
          onSave={(data) => {
            const newEvent = {
              ...data,
              id: Date.now(),
              // Color will be assigned when rendering
            };
            setMeeting([...meeting, newEvent]);
            setShowMeetingModal(false);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}