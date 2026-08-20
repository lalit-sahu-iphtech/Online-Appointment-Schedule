// src/component/AppointmentSchedule/AppointmentSchedule.jsx
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
} from "react-icons/fa";
import AppointmentCard from "./AppointmentCard";
import CreateAppointment from "../CreateAppointment/CreateAppointment";
import { useAppointments } from "../../context/AppointmentContext";
import "./appointmentSchedule.css";
import { Navigate, useNavigate } from "react-router-dom";

const MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", 
                "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function AppointmentSchedule() {
  const navigate = useNavigate(); 
  const { appointments, addAppointment, deleteAppointment, loading } = useAppointments();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("month");
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");

  const[currentUser, setCurrentUser] = useState(null);
  const[checkingAuth, setCheckingAuth] = useState(true);
  
  // ✅ State for topbar dropdowns
  const [activePanel, setActivePanel] = useState(null); // 'search' | 'notifications' | 'comments' | 'profile'

  // ✅ Toggle panels
  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  // ✅ Close panel on outside click
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

  // ✅ Initialize expanded months from appointments
  const [expandedMonths, setExpandedMonths] = useState(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    return state;
  });

  // ✅ Update expanded months when appointments change
  useEffect(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    setExpandedMonths(state);
  }, [appointments]);

  useEffect(()=>{
    const stored = localStorage.getItem("currentUser");
    if(!stored){
      navigate("/signin");
      return;
    }
    try{
      setCurrentUser(JSON.parse(stored));
    }catch(error){
      console.log("Invalid currentUser in strorage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  },[navigate]);

const handleLogout = () =>{
  localStorage.removeItem("currentUser");
  setActivePanel(null);
  navigate("/signin");
}
const handleProfileClick = () =>{
  setActivePanel(null);
  navigate("/profile");
}

const handleSettingsClick = () =>{
  setActivePanel(null);
  navigate("/settings");
}

if(checkingAuth){
  return null;
}


  const toggleMonth = (monthName) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthName]: !prev[monthName]
    }));
  };

  const previousYear = () => setCurrentYear(y => y - 1);
  const nextYear = () => setCurrentYear(y => y + 1);
  const goToThisMonth = () => setCurrentYear(new Date().getFullYear());

  // ✅ Ensure all months exist in appointments
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

  // Only show months that have appointments or current month
  const visibleMonths = filteredMonths.filter(month => 
    month.appointments.length > 0 || month.month === MONTHS[new Date().getMonth()]
  );

  // ✅ Get upcoming notifications (same as Calendar)
  const getUpcomingNotifications = () => {
    const now = new Date();
    const notifications = [];
    
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
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
    });
    
    return notifications.sort((a, b) => a.diffMinutes - b.diffMinutes);
  };

  const upcomingNotifications = getUpcomingNotifications();

  const getNotificationLabel = (diffMinutes) => {
    if (diffMinutes > 1) return `Starts in ${Math.round(diffMinutes)} min`;
    if (diffMinutes >= -1) return "Starting now";
    return `Started ${Math.round(-diffMinutes)} min ago`;
  };

  // ✅ Comments count
  const getCommentsCount = () => {
    let count = 0;
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        if (apt.comments) count += apt.comments.length;
      });
    });
    return count;
  };

  // ✅ Search results
  const getSearchResults = () => {
    if (!search.trim()) return [];
    const results = [];
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        if (apt.title.toLowerCase().includes(search.trim().toLowerCase())) {
          results.push(apt);
        }
      });
    });
    return results;
  };

  const searchResults = getSearchResults();

  // ✅ Show loading state
  if (loading) {
    return <div className="appointment-layout">Loading...</div>;
  }

  return (
    <div className="appointment-layout">
      <section className="appointment-main">
        
        {/* ============================================
            TOPBAR - Calendar Style
            ============================================ */}
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
              
              {/* 🔍 SEARCH */}
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("search")}
                  aria-label="Search appointments"
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

              {/* 🔔 NOTIFICATIONS */}
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("notifications")}
                  aria-label="Notifications"
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
                            onClick={() => {
                              setActivePanel(null);
                            }}
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

              {/* 💬 COMMENTS */}
              <div className="appointment-icon-wrap">
                <button
                  className="appointment-icon-btn"
                  onClick={() => togglePanel("comments")}
                  aria-label="Comments"
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

              {/* 👤 PROFILE */}
              <div className="appointment-icon-wrap appointment-avatar-wrap" onClick={() => togglePanel("profile")}>
                <FaUserCircle className="appointment-avatar-icon" />
                <FaChevronDown className="appointment-avatar-chevron" />

                {activePanel === "profile" && (
                  <div className="appointment-icon-dropdown appointment-profile-dropdown">
                    <div className="appointment-profile-dropdown-header">
                      <FaUserCircle className="appointment-profile-avatar" />
                      <div>
                        <h4>My Account</h4>
                        <span>Manage your profile</span>
                      </div>
                    </div>

                    <div className="appointment-profile-menu">
                      <button type="button" className="appointment-profile-menu-item"onClick={handleProfileClick}>
                        <FaUser /> Profile
                      </button>
                      <button type="button" className="appointment-profile-menu-item"onClick={handleSettingsClick}>
                        <FaCog /> Settings
                      </button>
                      <button type="button" className="appointment-profile-menu-item appointment-profile-menu-logout"
                      onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ============================================
            SCHEDULE CONTAINER
            ============================================ */}
        <div className="schedule-container">
          {/* Toolbar */}
          <div className="schedule-toolbar">
            <div className="toolbar-left">
              <strong>{currentYear}</strong>
              <button className="year-btn" onClick={previousYear}>
                <FaChevronLeft />
              </button>
              <button className="year-btn" onClick={nextYear}>
                <FaChevronRight />
              </button>
              <button className="this-month" onClick={goToThisMonth}>
                This Month
              </button>
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

          {/* Week View */}
          {view === "week" ? (
            <div className="week-view">
              <div className="week-empty">
                <h2>Weekly Schedule</h2>
                <p>Your weekly appointment schedule will appear here.</p>
                <button onClick={() => setShowCreate(true)}>
                  <FaPlus /> Create Appointment
                </button>
              </div>
            </div>
          ) : (
            /* Month View */
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
          onSave={addAppointment}
        />
      )}
    </div>
  );
}