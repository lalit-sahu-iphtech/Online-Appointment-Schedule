// src/component/Calendar/Calendar.jsx
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaRegBell,
  FaRegCommentDots,
  FaUserCircle,
  FaChevronDown,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import AddMeetingModal from "./AddMeetingModal";
import "./calendar.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EventDetailsModal from "./EventDetailsModal";
import { getRandomEventColor } from "../../utils/colorUtils";

import Reminder from "./Reminder";

import {
  getWeekDays,
  formatDate,
  getDayDate,
  getMonthYear,
} from "../../utils/dateUtils";

import Topbar from "../Comman/Topbar";
import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationLabel } from "../../utils/notificationService";
import { useNotificationsContext } from "../../context/NotificationContext";

// ✅ Firebase Services
import {
  getMeetings,
  addMeeting as firebaseAddMeeting,
  updateMeeting as firebaseUpdateMeeting,
  deleteMeeting as firebaseDeleteMeeting
} from "../../services/firestoreService";

export default function Calendar({ onEventsChange, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const [meeting, setMeeting] = useState([]);
  const [activePanel, setActivePanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Get notification context
  const { addNotifications } = useNotificationsContext();

  // ===== AUTH GUARD =====
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/signin");
      return;
    }
    try {
      const user = JSON.parse(stored);
      setCurrentUser(user);
    } catch (error) {
      console.error("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate, location.pathname]);

  // Har 30 second me "now" refresh
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // ===== ✅ LOAD MEETINGS FROM FIREBASE =====
  useEffect(() => {
    loadMeetings();
  }, []);

  // ✅ Load meetings from Firebase
  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      console.log("📥 Calendar meetings loaded:", data.length);
      
      // ✅ Ensure all meetings have date and startTime
      const formattedData = data.map(item => ({
        ...item,
        id: item.id,
        color: item.color || getRandomEventColor(item.id)?.id || "purple",
        // ✅ Default values if missing
        date: item.date || new Date().toISOString().split('T')[0],
        startTime: item.startTime || "09:00",
        endTime: item.endTime || "10:00"
      }));
      
      setMeeting(formattedData);
      if (onEventsChange) onEventsChange(formattedData);
    } catch (error) {
      console.error("❌ Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== ✅ CRUD OPERATIONS WITH FIREBASE =====

  // ✅ Save meeting to Firebase
  const handleSaveMeeting = async (data) => {
    try {
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;

      const newMeeting = {
        ...data,
        organizerEmail: user?.email || "unknown",
        organizerName: user?.email?.split('@')[0] || "User"
      };

      const saved = await firebaseAddMeeting(newMeeting);
      await loadMeetings();
      return saved;
    } catch (error) {
      console.error("❌ Error saving meeting:", error);
      throw error;
    }
  };

  // ✅ Update meeting in Firebase
  const handleUpdateMeeting = async (id, data) => {
    try {
      await firebaseUpdateMeeting(id, data);
      await loadMeetings();
    } catch (error) {
      console.error("❌ Error updating meeting:", error);
    }
  };

  // ✅ Delete meeting from Firebase
  const handleDeleteMeeting = async (id) => {
    try {
      await firebaseDeleteMeeting(id);
      await loadMeetings();
    } catch (error) {
      console.error("❌ Error deleting meeting:", error);
    }
  };

  // ===== NOTIFICATIONS =====
  const {
    notifications: upcomingNotifications,
    count: notificationCount,
    getLabel,
  } = useNotifications(meeting, 60);

  // ✅ Debug: Check notifications
  console.log("📢 Calendar meetings count:", meeting.length);
  console.log("📢 Calendar notifications:", upcomingNotifications);

  // ✅ Add calendar notifications to global context
  useEffect(() => {
    if (upcomingNotifications.length === 0) {
      console.log("📢 No upcoming calendar notifications");
      return;
    }
    
    const formattedNotifications = upcomingNotifications.map(n => ({
      id: n.id,
      title: n.title,
      diffMinutes: n.diffMinutes,
      date: n.date,
      time: n.startTime,
      location: n.location,
      source: "calendar",
    }));
    console.log("📢 Adding calendar notifications:", formattedNotifications);
    addNotifications("calendar", formattedNotifications);
  }, [upcomingNotifications, addNotifications]);

  // ===== COMMENTS =====
  const meetingsWithComments = meeting.filter(
    (item) => item.comments && item.comments.length > 0
  );

  const addComment = (eventId, text) => {
    const newComment = { id: Date.now(), text, time: new Date().toISOString() };
    setMeeting((prev) =>
      prev.map((m) =>
        m.id === eventId ? { ...m, comments: [...(m.comments || []), newComment] } : m
      )
    );
    setSelectedEvent((prev) =>
      prev && prev.id === eventId
        ? { ...prev, comments: [...(prev.comments || []), newComment] }
        : prev
    );
  };

  // ===== SEARCH RESULTS =====
  const searchResults = searchTerm.trim()
    ? meeting.filter((item) =>
        item.meetingName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : [];

  // ===== NAVIGATION =====
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

  // ===== EVENT POSITION & COLOR =====
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

  const getEventColor = (event) => {
    if (event.color) {
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
    const color = getRandomEventColor(event.id);
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

  // ===== HANDLERS =====
  const handleJoinMeeting = (event) => {
    console.log("Joining meeting:", event);
    if (event.onlineLink) {
      window.open(event.onlineLink, "_blank");
    }
  };

  const handleDismissReminder = (eventId) => {
    console.log("Reminder dismissed:", eventId);
  };

  const handleEditMeeting = (event) => {
    setSelectedEvent(null);
    setEditingEvent(event);
    setShowMeetingModal(true);
  };

  const handleShareMeeting = (event) => {
    const link = event.onlineLink || window.location.href;

    if (navigator.share) {
      navigator
        .share({
          title: event.meetingName || "Meeting",
          text: `Join "${event.meetingName || "this meeting"}"`,
          url: link,
        })
        .catch(() => {});
      return;
    }

    navigator.clipboard.writeText(link);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };

  // ===== PROFILE ACTIONS =====
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  if (checkingAuth) {
    return null;
  }

  if (loading) {
    return <div className="calendar-loading">Loading meetings...</div>;
  }

  return (
    <>
      <Topbar
        title="Calendar"
        createButtonLabel="Create"
        onCreateClick={() => setShowMeetingModal(true)}
        searchPlaceholder="Search by meeting name"
        searchResults={searchResults.map(item => ({
          id: item.id,
          title: item.meetingName,
          date: item.date,
        }))}
        onSearchChange={(value) => setSearchTerm(value)}
        onSearchResultClick={(item) => {
          const event = meeting.find(m => m.id === item.id);
          if (event) setSelectedEvent(event);
          setSearchTerm("");
        }}
        commentsCount={meetingsWithComments.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      {/* CALENDAR CONTAINER */}
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
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "week" && (
          <WeekView
            meeting={meeting}
            getEventPosition={getEventPosition}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "month" && (
          <MonthView
            meeting={meeting}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}
      </div>

      {/* MODALS */}
      {showMeetingModal && (
        <AddMeetingModal
          onClose={() => {
            setShowMeetingModal(false);
            setEditingEvent(null);
          }}
          defaultDate={formatDate(currentDate)}
          initialData={editingEvent}
          isEditMode={!!editingEvent}
          onSave={(data) => {
            if (editingEvent) {
              // ✅ Update existing meeting
              handleUpdateMeeting(editingEvent.id, data);
            } else {
              // ✅ Create new meeting
              handleSaveMeeting(data);
            }
            setShowMeetingModal(false);
            setEditingEvent(null);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddComment={(text) => addComment(selectedEvent.id, text)}
          onEdit={handleEditMeeting}
          onShare={handleShareMeeting}
        />
      )}

      {/* Toast */}
      {shareToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#20242a",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontFamily: '"Poppins", sans-serif',
            zIndex: 2000,
            boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          }}
        >
          Link copied to clipboard!
        </div>
      )}

      <Reminder
        events={meeting}
        onJoinMeeting={handleJoinMeeting}
        onDismiss={handleDismissReminder}
      />
    </>
  );
}