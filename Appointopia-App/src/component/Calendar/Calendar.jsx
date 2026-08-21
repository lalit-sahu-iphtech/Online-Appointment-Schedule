import { useState, useEffect } from "react";
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

export default function Calendar({ onEventsChange, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null); // NEW: logged-in user
  const [checkingAuth, setCheckingAuth] = useState(true); // NEW: avoid flashing calendar before redirect

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // meeting being edited (null = create mode)
  const [shareToast, setShareToast] = useState(false); // "Link copied" feedback
  const [meeting, setMeeting] = useState([]);
  const [activePanel, setActivePanel] = useState(null); // 'search' | 'notifications' | 'comments' | 'profile' | null
  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());

  // ===== NEW: AUTH GUARD =====
  // Calendar page (aur isliye "+ Create") sirf logged-in user access kar sake.
  // Agar localStorage me currentUser nahi hai to seedha /signin pe bhej do.
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
  }, [navigate,location.pathname]);

  // Har 30 second me "now" refresh karo taaki "starts in X min" sahi rahe
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('calendar_meetings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withColors = parsed.map(event => {
          if (!event.color) {
            const color = getRandomEventColor(event.id);
            return { ...event, color: color.id };
          }
          return event;
        });
        setMeeting(withColors);
        if (onEventsChange) {
          onEventsChange(withColors);
        }
      } catch (error) {
        console.error('Error loading meetings:', error);
        setMeeting([]);
      }
    }
  }, []);

  useEffect(() => {
    if (meeting.length > 0) {
      localStorage.setItem('calendar_meetings', JSON.stringify(meeting));
    } else {
      localStorage.removeItem('calendar_meetings');
    }
    if (onEventsChange) {
      onEventsChange(meeting);
    }
  }, [meeting, onEventsChange]);

  useEffect(() => {
    if (onDateChange) {
      onDateChange(currentDate);
    }
  }, [currentDate, onDateChange]);

  // Search / Notifications / Comments / Profile dropdown ko toggle karo
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // Bahar click karne par khula panel band ho jaaye
  useEffect(() => {
    if (!activePanel) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".icon-wrap")) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  const searchResults = searchTerm.trim()
    ? meeting.filter((item) =>
        item.meetingName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : [];

  // ===== UPCOMING MEETING REMINDER =====
  const getEventStartDateTime = (item) => {
    if (!item.date || !item.startTime) return null;
    const [y, mo, d] = item.date.split("-").map(Number);
    const [h, m] = item.startTime.split(":").map(Number);
    return new Date(y, mo - 1, d, h, m, 0, 0);
  };

  const upcomingNotifications = meeting
    .map((item) => {
      const start = getEventStartDateTime(item);
      if (!start) return null;
      const diffMinutes = (start - now) / 60000;
      return { item, diffMinutes };
    })
    .filter((entry) => entry && entry.diffMinutes >= -10 && entry.diffMinutes <= 60)
    .sort((a, b) => a.diffMinutes - b.diffMinutes);

  const getNotificationLabel = (diffMinutes) => {
    if (diffMinutes > 1) return `Starts in ${Math.round(diffMinutes)} min`;
    if (diffMinutes >= -1) return "Starting now";
    return `Started ${Math.round(-diffMinutes)} min ago`;
  };

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

  const handleJoinMeeting = (event) =>{
    console.log("Joining meetingn:", event);
    if(event.onlineLink){
      window.open(event.onlineLink, "_blank");
    }
  }

  const handleDismissReminder = (eventId) =>{
    console.log("Reminder dismissed:",eventId);
  }

  // ===== EDIT MEETING =====
  const handleEditMeeting = (event) => {
    setSelectedEvent(null);
    setEditingEvent(event);
    setShowMeetingModal(true);
  };

  // ===== SHARE MEETING =====
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

  // ===== NEW: PROFILE DROPDOWN ACTIONS =====
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setActivePanel(null);
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setActivePanel(null);
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    setActivePanel(null);
    navigate("/settings");
  };

  // Auth check hone tak (ya redirect hote waqt) kuch mat dikhao
  if (checkingAuth) {
    return null;
  }

  return (
    <>
      <div className="calendar-topbar">
        <h1>Calendar</h1>
        <div className="topbar-right">
          <button className="create-btn" onClick={() => setShowMeetingModal(true)}>
            <span>+</span> Create
          </button>
          <div className="topbar-icons">

            {/* SEARCH */}
            <div className="icon-wrap">
              <button
                className="icon-btn"
                onClick={() => togglePanel("search")}
                aria-label="Search meetings"
              >
                <FaSearch />
              </button>

              {activePanel === "search" && (
                <div className="icon-dropdown">
                  <h4>Search meetings</h4>
                  <div className="search-input-wrap">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search by meeting name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {searchTerm.trim() === "" && (
                    <div className="icon-dropdown-empty">Type to search your meetings</div>
                  )}

                  {searchTerm.trim() !== "" && searchResults.length === 0 && (
                    <div className="icon-dropdown-empty">No meetings found</div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="search-result-list">
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          className="search-result-item"
                          onClick={() => {
                            setSelectedEvent(item);
                            setActivePanel(null);
                            setSearchTerm("");
                          }}
                        >
                          <span>{item.meetingName}</span>
                          <span className="search-result-date">{item.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATIONS */}
            <div className="icon-wrap">
              <button
                className="icon-btn"
                onClick={() => togglePanel("notifications")}
                aria-label="Notifications"
              >
                <FaRegBell />
                {upcomingNotifications.length > 0 && <span className="icon-badge"></span>}
              </button>

              {activePanel === "notifications" && (
                <div className="icon-dropdown">
                  <h4>Upcoming meetings</h4>
                  {upcomingNotifications.length === 0 ? (
                    <div className="icon-dropdown-empty">No meeting starting soon</div>
                  ) : (
                    <div className="search-result-list">
                      {upcomingNotifications.map(({ item, diffMinutes }) => (
                        <div
                          key={item.id}
                          className="search-result-item"
                          onClick={() => {
                            setSelectedEvent(item);
                            setActivePanel(null);
                          }}
                        >
                          <span>{item.meetingName}</span>
                          <span className="search-result-date">
                            {getNotificationLabel(diffMinutes)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* COMMENTS */}
            <div className="icon-wrap">
              <button
                className="icon-btn"
                onClick={() => togglePanel("comments")}
                aria-label="Comments"
              >
                <FaRegCommentDots />
                {meetingsWithComments.length > 0 && <span className="icon-badge"></span>}
              </button>

              {activePanel === "comments" && (
                <div className="icon-dropdown">
                  <h4>Comments</h4>
                  {meetingsWithComments.length === 0 ? (
                    <div className="icon-dropdown-empty">No comments yet</div>
                  ) : (
                    <div className="search-result-list">
                      {meetingsWithComments.map((item) => (
                        <div
                          key={item.id}
                          className="search-result-item"
                          onClick={() => {
                            setSelectedEvent(item);
                            setActivePanel(null);
                          }}
                        >
                          <span>{item.meetingName}</span>
                          <span className="search-result-date">
                            {item.comments.length} comment{item.comments.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="icon-wrap avatar-wrap" onClick={() => togglePanel("profile")}>
              <FaUserCircle className="avatar-icon" />
              <FaChevronDown className="avatar-chevron" />

              {activePanel === "profile" && (
                <div className="icon-dropdown profile-dropdown">
                  <div className="profile-dropdown-header">
                    <FaUserCircle className="profile-dropdown-avatar" />
                    <div>
                      <h4>{currentUser?.email ? currentUser.email.split("@")[0] : "My Account"}</h4>
                      <span>{currentUser?.email || "Manage your profile"}</span>
                    </div>
                  </div>

                  <div className="profile-menu">
                    <button type="button" className="profile-menu-item" onClick={handleProfileClick}>
                      <FaUser /> Profile
                    </button>
                    <button type="button" className="profile-menu-item" onClick={handleSettingsClick}>
                      <FaCog /> Settings
                    </button>
                    <button type="button" className="profile-menu-item profile-menu-logout" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
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
          onClose={() => {
            setShowMeetingModal(false);
            setEditingEvent(null);
          }}
          defaultDate={formatDate(currentDate)}
          initialData={editingEvent}
          isEditMode={!!editingEvent}
          onSave={(data) => {
            if (editingEvent) {
              setMeeting((prev) =>
                prev.map((m) =>
                  m.id === editingEvent.id ? { ...m, ...data, id: editingEvent.id } : m
                )
              );
            } else {
              const newEvent = { ...data, id: Date.now() };
              setMeeting((prev) => [...prev, newEvent]);
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

      {/* "link copied" toast for Share fallback */}
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