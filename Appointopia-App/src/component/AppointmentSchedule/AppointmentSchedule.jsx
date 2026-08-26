// src/component/AppointmentSchedule/AppointmentSchedule.jsx
import { getEventColor } from "../../utils/colorUtils";

import { useState, useEffect, useMemo } from "react";
import {
  FaPlus,
  FaSearch,
  FaRegBell,
  FaRegCommentDots,
  FaUserCircle,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaFilter,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

// ✅ Firebase Services
import {
  getAppointments,
  addAppointment as firebaseAddAppointment,
  updateAppointment as firebaseUpdateAppointment,
  deleteAppointment as firebaseDeleteAppointment
} from "../../services/firestoreService";

import AppointmentCard from "./AppointmentCard";
import CreateAppointment from "../CreateAppointment/CreateAppointment";
import "./appointmentSchedule.css";
import { useLocation, useNavigate } from "react-router-dom";

import Topbar from "../Comman/Topbar";

import { useNotifications } from "../../hooks/useNotifications";
import { getNotificationLabel } from "../../utils/notificationService";
import { useNotificationsContext } from "../../context/NotificationContext";

const MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", 
                "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function AppointmentSchedule() {

  const navigate = useNavigate();
  const location = useLocation();
  
  // ===== ALL STATE HOOKS =====
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("month");
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // ✅ Week view expanded events state
  const [expandedWeekEvents, setExpandedWeekEvents] = useState({});

  // ✅ Edit mode state
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    location: "",
    startTime: "",
    endTime: "",
    duration: "",
    color: "purple",
    bookings: 0,
    bookingPage: ""
  });

  // Initialize expanded months
  const [expandedMonths, setExpandedMonths] = useState({});

  // Get notification context
  const { addNotifications } = useNotificationsContext();

  // ===== ALL EFFECTS =====
  
  // Toggle panels
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // Close panel on outside click
  useEffect(() => {
    if (!activePanel) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".appointment-icon-wrap")) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  // Auth check
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
      console.log("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate, location.pathname]);

  // ===== ✅ LOAD APPOINTMENTS FROM FIREBASE =====
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      console.log("📥 Appointments loaded from Firebase:", data.length);
      
      if (data.length === 0) {
        console.log("📭 No appointments found");
        setAppointments([]);
        setLoading(false);
        return;
      }

      const formattedData = data.map(item => ({
        ...item,
        id: item.id,
        date: item.date || new Date().toISOString().split('T')[0],
        startTime: item.startTime || "09:00",
        endTime: item.endTime || "10:00",
        title: item.title || item.meetingName || "Untitled",
        duration: item.duration || "30 min",
        location: item.location || "",
        bookings: item.bookings || 0,
        color: item.color || "purple",
        bookingPage: item.bookingPage || "",
        month: item.targetMonth || new Date(item.date).toLocaleString('default', { month: 'long' }).toUpperCase()
      }));
      
      console.log("📊 Formatted appointments:", formattedData.length);
      
      const monthsMap = {};
      formattedData.forEach(apt => {
        const monthKey = apt.month || new Date(apt.date).toLocaleString('default', { month: 'long' }).toUpperCase();
        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = { month: monthKey, appointments: [] };
        }
        monthsMap[monthKey].appointments.push(apt);
      });
      
      const groupedAppointments = Object.values(monthsMap);
      console.log("📊 Grouped months:", groupedAppointments.map(m => m.month));
      setAppointments(groupedAppointments);
      
      const state = {};
      groupedAppointments.forEach(month => {
        state[month.month] = true;
      });
      setExpandedMonths(state);
    } catch (error) {
      console.error("❌ Error loading appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== ✅ TOGGLE WEEK EVENTS =====
  const toggleWeekEvents = (dateStr) => {
    setExpandedWeekEvents(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  // ===== ✅ EDIT FUNCTIONS =====
  const startEditing = (appointment) => {
    setEditingEvent(appointment.id);
    setEditFormData({
      title: appointment.title || "",
      location: appointment.location || "",
      startTime: appointment.startTime || "09:00",
      endTime: appointment.endTime || "10:00",
      duration: appointment.duration || "30 min",
      color: appointment.color || "purple",
      bookings: appointment.bookings || 0,
      bookingPage: appointment.bookingPage || ""
    });
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    setEditFormData({
      title: "",
      location: "",
      startTime: "",
      endTime: "",
      duration: "",
      color: "purple",
      bookings: 0,
      bookingPage: ""
    });
  };

  const saveEdit = async (appointmentId) => {
    try {
      const updatedData = {
        title: editFormData.title,
        location: editFormData.location,
        startTime: editFormData.startTime,
        endTime: editFormData.endTime,
        duration: editFormData.duration,
        color: editFormData.color,
        bookings: editFormData.bookings,
        bookingPage: editFormData.bookingPage,
        updatedAt: new Date().toISOString()
      };
      
      await firebaseUpdateAppointment(appointmentId, updatedData);
      await loadAppointments();
      cancelEditing();
      console.log("✅ Appointment updated successfully!");
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
      alert("Failed to update appointment. Please try again.");
    }
  };

  // ===== ✅ CRUD OPERATIONS =====
  const handleAddAppointment = async (newAppointment, targetMonth) => {
    try {
      console.log("📝 Adding appointment:", newAppointment, "to month:", targetMonth);
      
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;

      const appointmentWithDate = {
        ...newAppointment,
        targetMonth: targetMonth,
        month: targetMonth,
        organizerEmail: user?.email || "unknown",
        organizerName: user?.email?.split('@')[0] || "User",
        date: newAppointment.date || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await firebaseAddAppointment(appointmentWithDate);
      console.log("✅ Appointment saved to Firebase, reloading...");
      await loadAppointments();
    } catch (error) {
      console.error("❌ Error adding appointment:", error);
    }
  };

  const handleUpdateAppointment = async (id, data) => {
    try {
      console.log("✏️ Updating appointment:", id, data);
      await firebaseUpdateAppointment(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      await loadAppointments();
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await firebaseDeleteAppointment(id);
      await loadAppointments();
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
    }
  };

  // ===== HOOKS =====
  const getAllAppointments = useMemo(() => {
    const all = [];
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        all.push({
          ...apt,
          month: monthData.month
        });
      });
    });
    return all;
  }, [appointments]);

  const allAppointments = getAllAppointments;
  const {
    notifications: upcomingNotifications,
    count: notificationCount,
    getLabel,
  } = useNotifications(allAppointments, 60);

  useEffect(() => {
    const formattedNotifications = upcomingNotifications.map(n => ({
      id: n.id,
      title: n.title,
      diffMinutes: n.diffMinutes,
      date: n.date,
      time: n.startTime,
      location: n.location,
      source: "schedule",
    }));
    addNotifications("schedule", formattedNotifications);
  }, [upcomingNotifications, addNotifications]);

  // ===== CONDITIONAL RETURNS =====
  if (checkingAuth) {
    return null;
  }

  if (loading) {
    return <div className="appointment-layout">Loading appointments...</div>;
  }

  // ===== FUNCTIONS =====
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

  const toggleMonth = (monthName) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthName]: !prev[monthName]
    }));
  };

  const previousYear = () => setCurrentYear(y => y - 1);
  const nextYear = () => setCurrentYear(y => y + 1);
  const goToThisMonth = () => setCurrentYear(new Date().getFullYear());

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToThisWeek = () => {
    setCurrentWeekStart(new Date());
  };

  const getWeekRangeText = () => {
    const weekDays = getWeekDates(currentWeekStart);
    const start = weekDays[0];
    const end = weekDays[6];
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
    }
    return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
  };

  const getWeekDates = (startDate) => {
    const today = new Date(startDate);
    const currentDay = today.getDay();
    const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getAppointmentsForDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const allAppointments = getAllAppointments;
    return allAppointments.filter(apt => apt.date === dateStr);
  };

  const getEventPosition = (startTime, endTime) => {
    const [startHour, startMinute] = startTime ? startTime.split(":").map(Number) : [9, 0];
    const [endHour, endMinute] = endTime ? endTime.split(":").map(Number) : [10, 0];
    const calendarStartHour = 0;
    const startMinutes = (startHour - calendarStartHour) * 60 + startMinute;
    const endMinutes = (endHour - calendarStartHour) * 60 + endMinute;
    
    const SLOT_HEIGHT = 58;
    const HEADER_HEIGHT = 40;
    
    const top = HEADER_HEIGHT + (startMinutes / 60) * SLOT_HEIGHT;
    const durationMinutes = endMinutes - startMinutes;
    const height = (durationMinutes / 60) * SLOT_HEIGHT;
    
    return { 
      top, 
      height: Math.max(height, 32),
      duration: durationMinutes
    };
  };

  // Week days and time slots
  const weekDays = getWeekDates(currentWeekStart);
  const weekDayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const today = new Date();

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    const ampm = i >= 12 ? 'PM' : 'AM';
    const displayHour = i === 0 ? 12 : (i > 12 ? i - 12 : i);
    timeSlots.push(`${displayHour}:00 ${ampm}`);
  }

  // Month view
  const allMonths = MONTHS.map(month => {
    const existing = appointments.find(a => a.month === month);
    if (existing) return existing;
    return {
      month,
      events: "0 Events",
      appointments: []
    };
  });

  const filteredMonths = allMonths.map(month => {
    let filtered = month.appointments;
    
    if (search) {
      filtered = filtered.filter(apt => 
        apt.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(apt => 
        apt.title.toLowerCase().includes(filterType.toLowerCase())
      );
    }
    
    if (filterDuration !== "all") {
      filtered = filtered.filter(apt => apt.duration === filterDuration);
    }
    
    return {
      ...month,
      appointments: filtered,
      events: `${filtered.length} Event${filtered.length !== 1 ? 's' : ''}`
    };
  });

  const visibleMonths = filteredMonths.filter(month => 
    month.appointments.length > 0 || month.month === MONTHS[new Date().getMonth()]
  );

  const getCommentsCount = () => {
    let count = 0;
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        if (apt.comments) count += apt.comments.length;
      });
    });
    return count;
  };

  const getSearchResults = () => {
    if (!search.trim()) return [];
    const results = [];
    const allAppointments = getAllAppointments;
    allAppointments.forEach(apt => {
      if (apt.title.toLowerCase().includes(search.trim().toLowerCase())) {
        results.push({
          id: apt.id,
          title: apt.title,
          date: apt.date || "Today",
        });
      }
    });
    return results;
  };

  const searchResults = getSearchResults();

  const colors = [
    { name: 'purple', bg: '#8755d5', text: '#ffffff' },
    { name: 'teal', bg: '#13a6ad', text: '#ffffff' },
    { name: 'orange', bg: '#ff8100', text: '#ffffff' },
    { name: 'blue', bg: '#2F80D7', text: '#ffffff' },
    { name: 'pink', bg: '#E84C8A', text: '#ffffff' },
    { name: 'green', bg: '#27AE60', text: '#ffffff' },
    { name: 'red', bg: '#E74C3C', text: '#ffffff' },
    { name: 'yellow', bg: '#F2C94C', text: '#1a1a1a' },
    { name: 'indigo', bg: '#4A56E2', text: '#ffffff' },
    { name: 'brown', bg: '#8B5E3C', text: '#ffffff' }
  ];

  // ✅ Render month edit form
  const renderMonthEditForm = (appointment) => {
    return (
      <div className="month-edit-form" style={{
        padding: '16px',
        background: 'white',
        borderRadius: '12px',
        border: '2px solid #8555d5',
        boxShadow: '0 4px 20px rgba(133, 85, 213, 0.15)',
        width: '100%',
        minHeight: '260px',
        boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <strong style={{ fontSize: '14px', color: '#1a1a1a' }}>Edit Appointment</strong>
          <button 
            onClick={cancelEditing} 
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        <input
          type="text"
          value={editFormData.title}
          onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
          placeholder="Title"
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            marginBottom: '8px', 
            border: '2px solid #3b82f6', 
            borderRadius: '8px', 
            fontSize: '13px',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
        
        <input
          type="text"
          value={editFormData.location}
          onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
          placeholder="Location"
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            marginBottom: '8px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            fontSize: '13px',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="time"
            value={editFormData.startTime}
            onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <input
            type="time"
            value={editFormData.endTime}
            onChange={(e) => setEditFormData({...editFormData, endTime: e.target.value})}
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={editFormData.duration}
            onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
            placeholder="Duration"
            style={{ 
              flex: 1, 
              padding: '8px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '13px',
              outline: 'none'
            }}
          />
          <input
            type="number"
            value={editFormData.bookings}
            onChange={(e) => setEditFormData({...editFormData, bookings: parseInt(e.target.value) || 0})}
            placeholder="Bookings"
            style={{ 
              width: '80px', 
              padding: '8px 12px', 
              border: '1px solid #e5e7eb', 
              borderRadius: '8px', 
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        <input
          type="text"
          value={editFormData.bookingPage}
          onChange={(e) => setEditFormData({...editFormData, bookingPage: e.target.value})}
          placeholder="Booking page URL"
          style={{ 
            width: '100%', 
            padding: '8px 12px', 
            marginBottom: '8px', 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            fontSize: '13px',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>Color:</span>
          {colors.map(color => (
            <button
              key={color.name}
              onClick={() => setEditFormData({...editFormData, color: color.name})}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: editFormData.color === color.name ? '3px solid #1a1a1a' : '2px solid #e5e7eb',
                background: color.bg,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: editFormData.color === color.name ? '0 0 0 2px #8555d5' : 'none'
              }}
              title={color.name}
            />
          ))}
        </div>
        
        <button
          onClick={() => saveEdit(appointment.id)}
          style={{
            width: '100%',
            padding: '10px',
            background: '#8555d5',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#7544c8'}
          onMouseLeave={(e) => e.target.style.background = '#8555d5'}
        >
          <FaSave style={{ marginRight: '8px' }} /> Save Changes
        </button>
      </div>
    );
  };

  // ✅ Get events with +X more
  const getEventsWithMoreButton = (dayAppointments, dateStr, isExpanded) => {
    const MAX_VISIBLE = 3;
    const hasMore = dayAppointments.length > MAX_VISIBLE;
    const visibleEvents = isExpanded ? dayAppointments : dayAppointments.slice(0, MAX_VISIBLE);
    
    // Sort events by start time
    const sortedEvents = [...visibleEvents].sort((a, b) => {
      return (a.startTime || "09:00").localeCompare(b.startTime || "09:00");
    });
    
    // Group overlapping events
    const groups = [];
    sortedEvents.forEach(event => {
      const eventStart = event.startTime || "09:00";
      const eventEnd = event.endTime || "10:00";
      
      let placed = false;
      for (let group of groups) {
        const lastEvent = group[group.length - 1];
        const lastEnd = lastEvent.endTime || "10:00";
        if (eventStart >= lastEnd) {
          group.push(event);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groups.push([event]);
      }
    });
    
    return { groups, hasMore };
  };

  return (
    <div className="appointment-layout">
      <section className="appointment-main">
        
        <Topbar
          title="Appointment Schedule"
          createButtonLabel="Create"
          onCreateClick={() => setShowCreate(true)}
          searchPlaceholder="Search by appointment name"
          searchResults={searchResults}
          onSearchChange={(value) => setSearch(value)}
          onSearchResultClick={() => {
            setActivePanel(null);
            setSearch("");
          }}
          commentsCount={getCommentsCount()}
          currentUser={currentUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onSettingsClick={handleSettingsClick}
        />

        <div className="schedule-container">
          
          {/* Toolbar */}
          <div className="schedule-toolbar">
            <div className="toolbar-left">
              <strong>
                {view === "week" ? getWeekRangeText() : currentYear}
              </strong>
              
              {view === "week" ? (
                <>
                  <button className="year-btn" onClick={goToPreviousWeek}>
                    <FaChevronLeft />
                  </button>
                  <button className="year-btn" onClick={goToNextWeek}>
                    <FaChevronRight />
                  </button>
                  <button className="this-month" onClick={goToThisWeek}>
                    This Week
                  </button>
                </>
              ) : (
                <>
                  <button className="year-btn" onClick={previousYear}>
                    <FaChevronLeft />
                  </button>
                  <button className="year-btn" onClick={nextYear}>
                    <FaChevronRight />
                  </button>
                  <button className="this-month" onClick={goToThisMonth}>
                    This Month
                  </button>
                </>
              )}
            </div>

            <div className="toolbar-right">
              <div className="view-switch">
                <button className={view === "week" ? "active" : ""} onClick={() => setView("week")}>
                  Week
                </button>
                <button className={view === "month" ? "active" : ""} onClick={() => setView("month")}>
                  Month
                </button>
              </div>
              <button className="filter-button" onClick={() => setShowFilter(!showFilter)}>
                <FaFilter /> Filter
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="filter-panel">
              <div>
                <label>Event Type</label>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                  <option value="all">All Events</option>
                  <option value="one-on-one">One-on-one</option>
                  <option value="monthly review">Monthly Review</option>
                  <option value="user interview">User Interview</option>
                </select>
              </div>
              <div>
                <label>Duration</label>
                <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
                  <option value="all">Any Duration</option>
                  <option value="30 mins">30 mins</option>
                  <option value="60 mins">60 mins</option>
                  <option value="90 mins">90 mins</option>
                </select>
              </div>
              <button onClick={() => setShowFilter(false)}>Apply</button>
              <button 
                onClick={() => {
                  setFilterType("all");
                  setFilterDuration("all");
                  setShowFilter(false);
                }}
                className="clear-filter"
              >
                Clear
              </button>
            </div>
          )}

          {/* ✅ WEEK VIEW - PROPER +X MORE */}
          {view === "week" ? (
            <div className="week-view-container">
              <div className="week-header">
                <div className="week-header-time">
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280' }}>
                    Time
                  </span>
                </div>
                {weekDays.map((day, index) => {
                  const isToday = today.toDateString() === day.toDateString();
                  const dayAppointments = getAppointmentsForDate(day);
                  return (
                    <div key={index} className="week-header-day">
                      <span className="week-day-name">{weekDayNames[index]}</span>
                      <span className={`week-day-number ${isToday ? 'today' : ''}`}>
                        {day.getDate()}
                      </span>
                      <span className="week-day-count">{dayAppointments.length} events</span>
                    </div>
                  );
                })}
              </div>

              <div className="week-body">
                <div className="week-time-column">
                  <div className="week-time-header">Time</div>
                  {timeSlots.map((time, index) => (
                    <div key={index} className="week-time-slot">{time}</div>
                  ))}
                </div>

                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const isToday = today.toDateString() === day.toDateString();
                  
                  const year = day.getFullYear();
                  const month = String(day.getMonth() + 1).padStart(2, '0');
                  const dayNum = String(day.getDate()).padStart(2, '0');
                  const dateStr = `${year}-${month}-${dayNum}`;
                  
                  const isExpanded = expandedWeekEvents[dateStr] || false;
                  const { groups, hasMore } = getEventsWithMoreButton(dayAppointments, dateStr, isExpanded);
                  
                  return (
                    <div key={dayIndex} className={`week-day-column ${isToday ? 'today-column' : ''}`}>
                      <div className="week-grid-lines">
                        {timeSlots.map((_, index) => (
                          <div key={index} className="week-grid-line"></div>
                        ))}
                      </div>

                      {/* ✅ Render events with proper positioning */}
                      {groups.map((group, groupIndex) => {
                        const groupSize = group.length;
                        const widthPerEvent = groupSize > 1 ? 100 / groupSize : 100;
                        
                        return group.map((appointment, eventIndex) => {
                          const startTime = appointment.startTime || "09:00";
                          const endTime = appointment.endTime || "10:00";
                          const { top, height } = getEventPosition(startTime, endTime);
                          const color = getEventColor(appointment.color || "purple");
                          
                          const offset = groupSize > 1 ? (eventIndex * widthPerEvent) : 0;
                          const width = groupSize > 1 ? widthPerEvent - 4 : 100;
                          
                          return (
                            <div
                              key={appointment.id}
                              className="week-event-item"
                              style={{
                                top: `${top}px`,
                                height: `${height}px`,
                                left: `${4 + (offset * 0.96)}%`,
                                width: `${width}%`,
                                background: color.bg,
                                color: color.text,
                                zIndex: 10 + eventIndex,
                                position: 'absolute',
                                borderRadius: '6px',
                                padding: '6px 8px',
                                fontSize: '11px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                                overflow: 'hidden',
                                cursor: 'default',
                                minHeight: '30px',
                                border: '1px solid rgba(255,255,255,0.2)',
                              }}
                            >
                              <button
                                className="week-event-delete"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Delete "${appointment.title}"?`)) {
                                    handleDeleteAppointment(appointment.id);
                                  }
                                }}
                              >
                                <FaTrash />
                              </button>
                              <strong>{appointment.title}</strong>
                              <span>
                                <FaClock style={{ fontSize: '8px', marginRight: '2px' }} />
                                {startTime} - {endTime}
                              </span>
                              {appointment.location && (
                                <span style={{ fontSize: '8px', opacity: 0.8 }}>
                                  📍 {appointment.location}
                                </span>
                              )}
                            </div>
                          );
                        });
                      })}

                      {/* ✅ +X More button - Proper position */}
                      {hasMore && !isExpanded && (
                        <div 
                          className="week-show-more-btn"
                          onClick={() => toggleWeekEvents(dateStr)}
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '4px 12px',
                            background: 'rgba(133, 85, 213, 0.9)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            zIndex: 50,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(4px)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateX(-50%) scale(1.05)';
                            e.target.style.background = 'rgba(133, 85, 213, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateX(-50%) scale(1)';
                            e.target.style.background = 'rgba(133, 85, 213, 0.9)';
                          }}
                        >
                          <FaChevronDown size={8} />
                          <span>+{dayAppointments.length - 3} more</span>
                        </div>
                      )}

                      {/* ✅ Show Less button */}
                      {hasMore && isExpanded && (
                        <div 
                          className="week-show-more-btn show-less"
                          onClick={() => toggleWeekEvents(dateStr)}
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            padding: '4px 12px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            zIndex: 50,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(4px)',
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateX(-50%) scale(1.05)';
                            e.target.style.background = 'rgba(239, 68, 68, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateX(-50%) scale(1)';
                            e.target.style.background = 'rgba(239, 68, 68, 0.9)';
                          }}
                        >
                          <FaChevronUp size={8} />
                          <span>Show less</span>
                        </div>
                      )}

                      {dayAppointments.length === 0 && (
                        <div className="week-day-empty">
                          <span>No events</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="week-create-btn-wrap">
                <button 
                  className="week-create-btn"
                  onClick={() => setShowCreate(true)}
                >
                  <FaPlus /> Create Appointment
                </button>
              </div>
            </div>
          ) : (
            /* ✅ MONTH VIEW */
            <div className="months-container">
              {visibleMonths.map((month) => (
                <div className="month-section" key={month.month}>
                  <div className="month-header" onClick={() => toggleMonth(month.month)}>
                    <div className="month-title">
                      <h2>{month.month}</h2>
                      <span>{month.events}</span>
                    </div>
                    <button>
                      {expandedMonths[month.month] ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                  </div>

                  {expandedMonths[month.month] && (
                    <div className="appointment-grid">
                      {month.appointments.length > 0 ? (
                        month.appointments.map((appointment) => {
                          const isEditing = editingEvent === appointment.id;
                          
                          if (isEditing) {
                            return (
                              <div key={appointment.id} className="appointment-card edit-mode">
                                <div className="appointment-card-content">
                                  {renderMonthEditForm(appointment)}
                                </div>
                              </div>
                            );
                          }
                          
                          return (
                            <AppointmentCard 
                              key={appointment.id} 
                              appointment={appointment}
                              onDelete={handleDeleteAppointment}
                              onUpdate={(updatedData) => {
                                handleUpdateAppointment(appointment.id, updatedData);
                              }}
                              onEdit={() => startEditing(appointment)}
                            />
                          );
                        })
                      ) : (
                        <div className="no-events">
                          <p>No appointments for {month.month}</p>
                          <button 
                            className="appointment-create-btn" 
                            onClick={() => setShowCreate(true)}
                            style={{ marginTop: "10px" }}
                          >
                            <span>+</span> Create
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Modal */}
      {showCreate && (
        <CreateAppointment
          onClose={() => setShowCreate(false)}
          onSave={(newAppointment, targetMonth) => {
            console.log("📝 CreateAppointment onSave called:", newAppointment, targetMonth);
            handleAddAppointment(newAppointment, targetMonth);
            setShowCreate(false);
            
            if (view === "week") {
              setCurrentWeekStart(new Date(currentWeekStart));
            }
          }}
        />
      )}
    </div>
  );
}