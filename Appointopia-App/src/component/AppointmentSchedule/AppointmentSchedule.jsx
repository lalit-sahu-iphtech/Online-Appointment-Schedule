import { useState } from "react";
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
} from "react-icons/fa";
import AppointmentCard from "./AppointmentCard";
import CreateAppointment from "../CreateAppointment/CreateAppointment";
import { useAppointments } from "../../context/AppointmentContext";
import "./appointmentSchedule.css";

const MONTHS = ["JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE", 
                "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];

export default function AppointmentSchedule() {
  const { appointments, addAppointment, deleteAppointment } = useAppointments();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("month");
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterDuration, setFilterDuration] = useState("all");
  const [expandedMonths, setExpandedMonths] = useState(() => {
    const state = {};
    appointments.forEach(month => {
      state[month.month] = month.appointments.length > 0;
    });
    return state;
  });

  const toggleMonth = (monthName) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthName]: !prev[monthName]
    }));
  };

  const previousYear = () => setCurrentYear(y => y - 1);
  const nextYear = () => setCurrentYear(y => y + 1);
  const goToThisMonth = () => setCurrentYear(new Date().getFullYear());

  // Ensure all months exist in appointments
  const allMonths = MONTHS.map(month => {
    const existing = appointments.find(a => a.month === month);
    if (existing) return existing;
    return {
      month,
      events: "0 Events",
      expanded: false,
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

  return (
    <div className="appointment-layout">
      <section className="appointment-main">
        
        {/* ============================================
            HEADER - Calendar style (Same as Calendar.jsx)
            ============================================ */}
        <div className="appointment-topbar">
          <h1>Appointment Schedule</h1>
          
          <div className="appointment-topbar-right">
            {/* Create Button - Same as Calendar */}
            <button 
              className="appointment-create-btn" 
              onClick={() => setShowCreate(true)}
            >
              <span>+</span> Create
            </button>

            {/* Icons - Same as Calendar */}
            <div className="appointment-topbar-icons">
              <button 
                className="appointment-icon-btn" 
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <FaSearch />
              </button>
              <button className="appointment-icon-btn">
                <FaRegBell />
                <span className="appointment-notification-dot"></span>
              </button>
              <button className="appointment-icon-btn">
                <FaRegCommentDots />
              </button>
              <div className="appointment-avatar-wrap">
                <FaUserCircle className="appointment-avatar-icon" />
                <FaChevronDown className="appointment-avatar-chevron" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Input - Shows when search icon clicked */}
        {searchOpen && (
          <div className="appointment-search-bar">
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        )}

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
                style={{ background: "#e5e7eb", color: "#374151" }}
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