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
} from "react-icons/fa";
import AppointmentCard from "./AppointmentCard";
import CreateAppointment from "../CreateAppointment/CreateAppointment";
import { useAppointments } from "../../context/AppointmentContext";
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
  const { appointments, addAppointment, deleteAppointment, updateAppointment, loading } = useAppointments();
  
  // ===== ALL STATE HOOKS (Top par) =====
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
  
  // Week view state
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());

  // Initialize expanded months
  const [expandedMonths, setExpandedMonths] = useState(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    return state;
  });

  // ===== ALL EFFECTS (Top par) =====
  
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

  useEffect(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    setExpandedMonths(state);
  }, [appointments]);

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

  // ===== HOOKS THAT MUST BE BEFORE CONDITIONAL RETURNS =====
  // Get all appointments for notifications
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

  // ✅ useNotifications hook - stable reference
  const allAppointments = getAllAppointments;
  const {
    notifications: upcomingNotifications,
    count: notificationCount,
    getLabel,
  } = useNotifications(allAppointments, 60);

  // Get notification context
  const { addNotifications } = useNotificationsContext();

  // ✅ Add schedule notifications to global context
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

  // ===== CONDITIONAL RETURNS (hooks ke BAAD) =====
  if (checkingAuth) {
    return null;
  }

  if (loading) {
    return <div className="appointment-layout">Loading...</div>;
  }

  // ===== REST OF THE FUNCTIONS =====

  // Profile actions
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

  // Month view navigation
  const previousYear = () => setCurrentYear(y => y - 1);
  const nextYear = () => setCurrentYear(y => y + 1);
  const goToThisMonth = () => setCurrentYear(new Date().getFullYear());

  // Week view navigation
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

  // Get week range text
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

  // Get week dates
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

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const allAppointments = getAllAppointments();
    return allAppointments.filter(apt => apt.date === dateStr);
  };

  // Get event position
  const getEventPosition = (startTime, endTime) => {
    const [startHour, startMinute] = startTime ? startTime.split(":").map(Number) : [9, 0];
    const [endHour, endMinute] = endTime ? endTime.split(":").map(Number) : [10, 0];
    const calendarStartHour = 7;
    const startMinutes = (startHour - calendarStartHour) * 60 + startMinute;
    const endMinutes = (endHour - calendarStartHour) * 60 + endMinute;
    
    const SLOT_HEIGHT = 58;
    const HEADER_HEIGHT = 40;
    
    const top = HEADER_HEIGHT + (startMinutes / 60) * SLOT_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * SLOT_HEIGHT;
    
    return { 
      top, 
      height: Math.max(height, 28)
    };
  };

  // Week days and time slots
  const weekDays = getWeekDates(currentWeekStart);
  const weekDayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const today = new Date();

  const timeSlots = [];
  for (let i = 7; i <= 23; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hour}:00 ${ampm}`);
  }

  // Month view - Ensure all months exist
  const allMonths = MONTHS.map(month => {
    const existing = appointments.find(a => a.month === month);
    if (existing) return existing;
    return {
      month,
      events: "0 Events",
      appointments: []
    };
  });

  // Filter appointments
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

  // ===== COMMENTS COUNT =====
  const getCommentsCount = () => {
    let count = 0;
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        if (apt.comments) count += apt.comments.length;
      });
    });
    return count;
  };

  // ===== SEARCH RESULTS =====
  const getSearchResults = () => {
    if (!search.trim()) return [];
    const results = [];
    const allAppointments = getAllAppointments();
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

  return (
    <div className="appointment-layout">
      <section className="appointment-main">
        
        {/* TOPBAR - No notifications props needed, reads from context */}
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

        {/* SCHEDULE CONTAINER */}
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
                  
                  return (
                    <div key={dayIndex} className={`week-day-column ${isToday ? 'today-column' : ''}`}>
                      <div className="week-grid-lines">
                        {timeSlots.map((_, index) => (
                          <div key={index} className="week-grid-line"></div>
                        ))}
                      </div>

                      {dayAppointments.map((appointment) => {
                        const startTime = appointment.startTime || "09:00";
                        const endTime = appointment.endTime || "10:00";
                        const { top, height } = getEventPosition(startTime, endTime);
                        const color = getEventColor(appointment.color || "purple");
                        
                        return (
                          <div
                            key={appointment.id}
                            className="week-event-item"
                            style={{
                              top: `${top}px`,
                              height: `${height}px`,
                              background: color.bg,
                              color: color.text,
                            }}
                          >
                            <button
                              className="week-event-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete "${appointment.title}"?`)) {
                                  deleteAppointment(appointment.id);
                                }
                              }}
                            >
                              <FaTrash />
                            </button>
                            <strong>{appointment.title}</strong>
                            <span>{startTime} - {endTime}</span>
                          </div>
                        );
                      })}

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
                        month.appointments.map((appointment) => (
                          <AppointmentCard 
                            key={appointment.id} 
                            appointment={appointment}
                            onDelete={deleteAppointment}
                            onUpdate={updateAppointment}
                          />
                        ))
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
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            
            const appointmentWithDate = {
              ...newAppointment,
              date: newAppointment.date || dateStr,
              startTime: newAppointment.startTime || `${String(today.getHours() + 1).padStart(2, '0')}:00`,
              endTime: newAppointment.endTime || `${String(today.getHours() + 2).padStart(2, '0')}:00`,
            };
            
            addAppointment(appointmentWithDate, targetMonth);
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