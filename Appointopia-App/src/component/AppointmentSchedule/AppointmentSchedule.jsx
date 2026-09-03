// src/component/AppointmentSchedule/AppointmentSchedule.jsx
import { getEventColor } from "../../utils/colorUtils";

import { useState, useEffect, useMemo, useRef } from "react";
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

// Firebase Services
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
import { useToast } from "../Toast";

const MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", 
                "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function AppointmentSchedule({ onAppointmentsSync, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
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

  // Week view expanded events state
  const [expandedWeekEvents, setExpandedWeekEvents] = useState({});

  // Edit mode state
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
  const isFirstRender = useRef(true);
  const prevDateRef = useRef(null);
  
  //  Notify parent when date changes (currentWeekStart or currentYear)
  useEffect(() => {
    // Skip first render to avoid unnecessary calls
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (onDateChange) {
      const dateToSend = view === "week" ? currentWeekStart : new Date(currentYear, 0, 1);
      
      //  Check if date actually changed
      const dateStr = dateToSend.toDateString();
      if (prevDateRef.current !== dateStr) {
        prevDateRef.current = dateStr;
        onDateChange(dateToSend);
      }
    }
  }, [currentWeekStart, currentYear, view, onDateChange]);

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
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate, location.pathname]);

  // ===== LOAD APPOINTMENTS FROM FIREBASE =====
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      
      if (data.length === 0) {
        setAppointments([]);
        setLoading(false);
        if (onAppointmentsSync) onAppointmentsSync([]);
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
      
      // Group appointments by month
      const monthsMap = {};
      formattedData.forEach(apt => {
        const monthKey = apt.month || new Date(apt.date).toLocaleString('default', { month: 'long' }).toUpperCase();
        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = { month: monthKey, appointments: [] };
        }
        monthsMap[monthKey].appointments.push(apt);
      });
      
      const groupedAppointments = Object.values(monthsMap);
      setAppointments(groupedAppointments);
      
      const state = {};
      groupedAppointments.forEach(month => {
        state[month.month] = true;
      });
      setExpandedMonths(state);
      
      //  Sync appointments to context for Sidebar
      if (onAppointmentsSync) {
        onAppointmentsSync(formattedData);
      }
      
    } catch (error) {
      setAppointments([]);
      toast.error('Load Failed', 'Failed to load appointments. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  // ===== TOGGLE WEEK EVENTS =====
  const toggleWeekEvents = (dateStr) => {
    setExpandedWeekEvents(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  // ===== EDIT FUNCTIONS =====
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
    toast.info('Editing', `Editing "${appointment.title}"`);
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
    toast.info('Edit Cancelled', 'Changes have been discarded.');
  };

  const saveEdit = async (appointmentId) => {
    const loadingToast = toast.loading('Saving Changes...', 'Please wait');
    
    try {
      if (!editFormData.title.trim()) {
        loadingToast.dismiss();
        toast.warning('Missing Title', 'Please enter an appointment title.');
        return;
      }
      
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
      
      loadingToast.success('Appointment Updated!', `"${editFormData.title}" has been updated successfully.`);
    } catch (error) {
      console.error("Error updating appointment:", error);
      loadingToast.error('Update Failed', error.message || 'Something went wrong. Please try again.');
    }
  };

  // ===== CRUD OPERATIONS =====
  const handleAddAppointment = async (newAppointment, targetMonth) => {
    const loadingToast = toast.loading('Creating Appointment...', 'Please wait');
    try {
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
      await loadAppointments();
      loadingToast.success('Appointment Created!', `"${newAppointment.title}" has been scheduled successfully.`);
    } catch (error) {
      loadingToast.error('Creation Failed', error.message || 'Something went wrong. Please try again.');
    }
  };

  // Update appointment — Local state update + Firebase update
  const handleUpdateAppointment = async (id, data) => {
    const loadingToast = toast.loading('Updating Appointment...', 'Please wait');
    
    try {
      await firebaseUpdateAppointment(id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state (INSTANT UI UPDATE)
      setAppointments(prevAppointments => {
        return prevAppointments.map(month => ({
          ...month,
          appointments: month.appointments.map(apt => 
            apt.id === id ? { ...apt, ...data } : apt
          )
        }));
      });
      
      // Background refresh (silent sync)
      await loadAppointments();
      
      loadingToast.success('Appointment Updated!', 'Changes saved successfully.');
    } catch (error) {
      loadingToast.error('Update Failed', error.message || 'Something went wrong.');
      await loadAppointments();
    }
  };

  // Delete appointment — Local state update + Firebase delete
  const handleDeleteAppointment = async (id) => {
    const loadingToast = toast.loading('Deleting Appointment...', 'Please wait');

    try {
      await firebaseDeleteAppointment(id);
      
      // Update local state (INSTANT UI UPDATE)
      setAppointments(prevAppointments => {
        return prevAppointments.map(month => ({
          ...month,
          appointments: month.appointments.filter(apt => apt.id !== id)
        })).filter(month => month.appointments.length > 0);
      });
      
      loadingToast.success('Appointment Deleted!', 'Removed successfully.');
    } catch (error) {
      loadingToast.error('Delete Failed', error.message || 'Something went wrong.');
      await loadAppointments();
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
    toast.success('Logged Out', 'You have been logged out successfully.');
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

  const previousYear = () => {
    setCurrentYear(y => y - 1);
    toast.info('Year Changed', `Showing ${currentYear - 1}`);
  };
  
  const nextYear = () => {
    setCurrentYear(y => y + 1);
    toast.info('Year Changed', `Showing ${currentYear + 1}`);
  };
  
  const goToThisMonth = () => {
    setCurrentYear(new Date().getFullYear());
    toast.info('This Month', 'Showing current month.');
  };

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
    toast.info('This Week', 'Showing current week.');
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

  // Render month edit form
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

  // Decide which of a day's appointments are visible vs hidden behind "+X more"
  const getVisibleDayEvents = (dayAppointments, isExpanded) => {
    const MAX_VISIBLE = 3;

    const sortedAll = [...dayAppointments].sort((a, b) => {
      return (a.startTime || "09:00").localeCompare(b.startTime || "09:00");
    });

    const hasMore = sortedAll.length > MAX_VISIBLE;
    const hiddenCount = Math.max(sortedAll.length - MAX_VISIBLE, 0);
    const visibleEvents = isExpanded ? sortedAll : sortedAll.slice(0, MAX_VISIBLE);

    return { visibleEvents, hasMore, hiddenCount };
  };

  // Lay out a day's events side-by-side
  const layoutDayEvents = (events) => {
    if (events.length === 0) return [];

    const sorted = [...events].sort((a, b) =>
      (a.startTime || "09:00").localeCompare(b.startTime || "09:00")
    );

    // Split into clusters of overlapping events
    const clusters = [];
    let cluster = [sorted[0]];
    let clusterEnd = sorted[0].endTime || "10:00";

    for (let i = 1; i < sorted.length; i++) {
      const ev = sorted[i];
      const start = ev.startTime || "09:00";
      const end = ev.endTime || "10:00";

      if (start < clusterEnd) {
        cluster.push(ev);
        if (end > clusterEnd) clusterEnd = end;
      } else {
        clusters.push(cluster);
        cluster = [ev];
        clusterEnd = end;
      }
    }
    clusters.push(cluster);

    // Within each cluster, pack events into columns
    const placements = [];
    clusters.forEach((clusterEvents) => {
      const columnEnds = [];
      const clusterPlacements = [];

      clusterEvents.forEach((event) => {
        const start = event.startTime || "09:00";
        const end = event.endTime || "10:00";

        let col = columnEnds.findIndex((endTime) => endTime <= start);
        if (col === -1) {
          col = columnEnds.length;
          columnEnds.push(end);
        } else {
          columnEnds[col] = end;
        }
        clusterPlacements.push({ event, col });
      });

      const totalCols = columnEnds.length;
      clusterPlacements.forEach((p) => placements.push({ ...p, totalCols }));
    });

    return placements;
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
                <button 
                  className={view === "week" ? "active" : ""} 
                  onClick={() => {
                    setView("week");
                    toast.info('Week View', 'Switched to week view.');
                  }}
                >
                  Week
                </button>
                <button 
                  className={view === "month" ? "active" : ""} 
                  onClick={() => {
                    setView("month");
                    toast.info('Month View', 'Switched to month view.');
                  }}
                >
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
                  toast.info('Filters Cleared', 'All filters have been reset.');
                }}
                className="clear-filter"
              >
                Clear
              </button>
            </div>
          )}

          {/* WEEK VIEW */}
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
                  const { visibleEvents, hasMore, hiddenCount } = getVisibleDayEvents(dayAppointments, isExpanded);
                  const placements = layoutDayEvents(visibleEvents);

                  // Find the bottom edge of the last VISIBLE event
                  let chipTop = 44;
                  placements.forEach(({ event }) => {
                    const evStart = event.startTime || "09:00";
                    const evEnd = event.endTime || "10:00";
                    const pos = getEventPosition(evStart, evEnd);
                    chipTop = Math.max(chipTop, pos.top + pos.height);
                  });
                  
                  return (
                    <div key={dayIndex} className={`week-day-column ${isToday ? 'today-column' : ''}`}>
                      <div className="week-grid-lines">
                        {timeSlots.map((_, index) => (
                          <div key={index} className="week-grid-line"></div>
                        ))}
                      </div>

                      {placements.map(({ event: appointment, col, totalCols }) => {
                        const startTime = appointment.startTime || "09:00";
                        const endTime = appointment.endTime || "10:00";
                        const { top, height } = getEventPosition(startTime, endTime);
                        const color = getEventColor(appointment.color || "purple");

                        const GAP = totalCols > 1 ? 2 : 0;
                        const usableWidth = 96;
                        const colWidth = (usableWidth - GAP * (totalCols - 1)) / totalCols;
                        const left = 2 + col * (colWidth + GAP);

                        return (
                          <div
                            key={appointment.id}
                            className="week-event-item"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              left: `${left}%`,
                              width: `${colWidth}%`,
                              background: color.bg,
                              color: color.text,
                              zIndex: 10 + col,
                            }}
                          >
                            <button
                              className="week-event-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAppointment(appointment.id);
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
                                {appointment.location}
                              </span>
                            )}
                          </div>
                        );
                      })}

                      {hasMore && (
                        <div 
                          className={`week-show-more-btn${isExpanded ? ' show-less' : ''}`}
                          onClick={() => toggleWeekEvents(dateStr)}
                          style={{
                            position: 'absolute',
                            top: `${chipTop + 6}px`,
                            right: '6px',
                            left: 'auto',
                            bottom: 'auto',
                            transform: 'none',
                            padding: '4px 10px',
                            background: isExpanded ? 'rgba(239, 68, 68, 0.9)' : 'rgba(133, 85, 213, 0.9)',
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            zIndex: 50,
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'transform 0.2s ease, background 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            backdropFilter: 'blur(4px)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.background = isExpanded ? 'rgba(239, 68, 68, 1)' : 'rgba(133, 85, 213, 1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.background = isExpanded ? 'rgba(239, 68, 68, 0.9)' : 'rgba(133, 85, 213, 0.9)';
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <FaChevronUp size={8} />
                              <span>Show less</span>
                            </>
                          ) : (
                            <>
                              <FaChevronDown size={8} />
                              <span>+{hiddenCount} more</span>
                            </>
                          )}
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
            /* MONTH VIEW */
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