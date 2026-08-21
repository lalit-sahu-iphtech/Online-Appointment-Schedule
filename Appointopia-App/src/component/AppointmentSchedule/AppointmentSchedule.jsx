import { getEventColor } from "../../utils/colorUtils";


import { useState, useEffect } from "react";
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

const MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", 
                "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function AppointmentSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointments, addAppointment, deleteAppointment, loading } = useAppointments();
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

  // Initialize expanded months
  const [expandedMonths, setExpandedMonths] = useState(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    return state;
  });

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

  if (checkingAuth) {
    return null;
  }

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

  // Get all appointments (flatten months)
  const getAllAppointments = () => {
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
  };

  // Get appointments for a specific date

const getAppointmentsForDate = (date) => {
  // ✅ Use LOCAL date format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const allAppointments = getAllAppointments();
  return allAppointments.filter(apt => apt.date === dateStr);
};

  // Get event color
  const getEventColor = (color) => {
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
    return colors[color] || colors.purple;
  };

  // Get event position - FIXED
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
      height: Math.max(height, 28) // Minimum 28px
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

  // Notifications
  const getUpcomingNotifications = () => {
    const now = new Date();
    const notifications = [];
    const allAppointments = getAllAppointments();
    
    allAppointments.forEach(apt => {
      if (apt.startTime) {
        const [hours, minutes] = apt.startTime.split(":").map(Number);
        const eventDate = new Date();
        eventDate.setHours(hours, minutes, 0, 0);
        
        const diffMinutes = (eventDate - now) / 60000;
        if (diffMinutes >= -10 && diffMinutes <= 60) {
          notifications.push({
            item: apt,
            diffMinutes
          });
        }
      }
    });
    return notifications.sort((a, b) => a.diffMinutes - b.diffMinutes);
  };

  const upcomingNotifications = getUpcomingNotifications();

  const getNotificationLabel = (diffMinutes) => {
    if (diffMinutes > 1) return `Starts in ${Math.round(diffMinutes)} min`;
    if (diffMinutes >= -1) return "Starting now";
    return `Started ${Math.round(-diffMinutes)} min ago`;
  };

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
    const allAppointments = getAllAppointments();
    allAppointments.forEach(apt => {
      if (apt.title.toLowerCase().includes(search.trim().toLowerCase())) {
        results.push(apt);
      }
    });
    return results;
  };

  const searchResults = getSearchResults();

  if (loading) {
    return <div className="appointment-layout">Loading...</div>;
  }

  return (
    <div className="appointment-layout">
      <section className="appointment-main">
        
        {/* TOPBAR */}
        <div className="appointment-topbar">
          <h1>Appointment Schedule</h1>
          
          <div className="appointment-topbar-right">
            <button 
              className="appointment-create-btn" 
              onClick={() => setShowCreate(true)}
            >
              <span>+</span> Create
            </button>

            <div className="appointment-topbar-icons">
              
              {/* SEARCH */}
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("search")}
                >
                  <FaSearch />
                </button>
                {activePanel === "search" && (
                  <div className="appointment-icon-dropdown">
                    <h4>Search appointments</h4>
                    <div className="appointment-search-input-wrap">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search by appointment name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    {search.trim() === "" && (
                      <div className="appointment-dropdown-empty">Type to search your appointments</div>
                    )}
                    {search.trim() !== "" && searchResults.length === 0 && (
                      <div className="appointment-dropdown-empty">No appointments found</div>
                    )}
                    {searchResults.length > 0 && (
                      <div className="appointment-search-result-list">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            className="appointment-search-result-item"
                            onClick={() => {
                              setActivePanel(null);
                              setSearch("");
                            }}
                          >
                            <span>{item.title}</span>
                            <span className="appointment-search-result-date">
                              {item.date || "Today"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* NOTIFICATIONS */}
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("notifications")}
                >
                  <FaRegBell />
                  {upcomingNotifications.length > 0 && (
                    <span className="appointment-icon-badge"></span>
                  )}
                </button>
                {activePanel === "notifications" && (
                  <div className="appointment-icon-dropdown">
                    <h4>Upcoming meetings</h4>
                    {upcomingNotifications.length === 0 ? (
                      <div className="appointment-dropdown-empty">No meeting starting soon</div>
                    ) : (
                      <div className="appointment-search-result-list">
                        {upcomingNotifications.map(({ item, diffMinutes }) => (
                          <div
                            key={item.id}
                            className="appointment-search-result-item"
                            onClick={() => setActivePanel(null)}
                          >
                            <span>{item.title}</span>
                            <span className="appointment-search-result-date">
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
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("comments")}
                >
                  <FaRegCommentDots />
                  {getCommentsCount() > 0 && (
                    <span className="appointment-icon-badge"></span>
                  )}
                </button>
                {activePanel === "comments" && (
                  <div className="appointment-icon-dropdown">
                    <h4>Comments</h4>
                    <div className="appointment-dropdown-empty">
                      {getCommentsCount() === 0 ? "No comments yet" : "Comments coming soon"}
                    </div>
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div className="appointment-icon-wrap appointment-avatar-wrap" onClick={() => togglePanel("profile")}>
                <FaUserCircle className="appointment-avatar-icon" />
                <FaChevronDown className="appointment-avatar-chevron" />
                {activePanel === "profile" && (
                  <div className="appointment-icon-dropdown appointment-profile-dropdown">
                    <div className="appointment-profile-dropdown-header">
                      <FaUserCircle className="appointment-profile-avatar" />
                      <div>
                        <h4>{currentUser?.email ? currentUser.email.split("@")[0] : "My Account"}</h4>
                        <span>{currentUser?.email || "Manage your profile"}</span>
                      </div>
                    </div>
                    <div className="appointment-profile-menu">
                      <button type="button" className="appointment-profile-menu-item" onClick={handleProfileClick}>
                        <FaUser /> Profile
                      </button>
                      <button type="button" className="appointment-profile-menu-item" onClick={handleSettingsClick}>
                        <FaCog /> Settings
                      </button>
                      <button type="button" className="appointment-profile-menu-item appointment-profile-menu-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

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

          {/* ============================================
              WEEK VIEW - FIXED
          ============================================ */}
          {view === "week" ? (
            <div className="week-view-container">
              {/* Week Header */}
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

              {/* Week Body */}
              <div className="week-body">
                {/* Time Column */}
                <div className="week-time-column">
                  <div className="week-time-header">Time</div>
                  {timeSlots.map((time, index) => (
                    <div key={index} className="week-time-slot">{time}</div>
                  ))}
                </div>

                {/* Day Columns */}
                {weekDays.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForDate(day);
                  const isToday = today.toDateString() === day.toDateString();
                  
                  return (
                    <div key={dayIndex} className={`week-day-column ${isToday ? 'today-column' : ''}`}>
                      {/* Grid lines */}
                      <div className="week-grid-lines">
                        {timeSlots.map((_, index) => (
                          <div key={index} className="week-grid-line"></div>
                        ))}
                      </div>

                      {/* Events - FIXED POSITION */}
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

                      {/* Empty state */}
                      {dayAppointments.length === 0 && (
                        <div className="week-day-empty">
                          <span>No events</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Create button in week view */}
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
            /* ============================================
                MONTH VIEW
            ============================================ */
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
            
            // Refresh week view
            if (view === "week") {
              setCurrentWeekStart(new Date(currentWeekStart));
            }
          }}
        />
      )}
    </div>
  );
}