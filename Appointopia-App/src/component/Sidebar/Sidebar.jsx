// src/component/Sidebar/Sidebar.jsx
import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaLink,
  FaCalendarCheck,
  FaSmile
} from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";
import { getNextEvent } from '../../utils/nextEventHelper';
import { formatTimeDisplay } from '../../utils/dateTimeHelper';

import logo from "../../assets/images/logo.png";
import "./sidebar.css";

const menuItems = [
  { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
  { path: "/appointment-schedule", label: "Appointment Schedule", icon: MdEventNote },
  { path: "/workflows", label: "Workflows", icon: BiGitBranch },
];

export default function Sidebar({ events = [], selectedDate = new Date() }) {
  const location = useLocation();
  const [nextEvent, setNextEvent] = useState(null);

  // ✅ Memoize events to prevent unnecessary re-renders
  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);

  console.log("📌 Sidebar received props:");
  console.log("  events length:", memoizedEvents.length);
  console.log("  selectedDate:", memoizedDate);

  // Calculate next event whenever events or selectedDate change
  useEffect(() => {
    console.log("🔄 Sidebar useEffect triggered");
    console.log("  events length:", memoizedEvents.length);
    
    if (memoizedEvents && memoizedEvents.length > 0 && memoizedDate) {
      const next = getNextEvent(memoizedEvents, memoizedDate);
      console.log("📌 Setting nextEvent:", next);
      setNextEvent(next);
    } else {
      console.log("❌ No events or selectedDate, setting nextEvent to null");
      setNextEvent(null);
    }
  }, [memoizedEvents, memoizedDate]);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="sidebar-link">
          <div className="logo-icon">
            <img src={logo} alt="Appointopia" />
            <span>Appointopia</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link to={path} key={path} className="sidebar-link">
              <div className={isActive ? "sidebar-item-active" : "sidebar-item"}>
                <Icon className="sidebar-icon" />
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Next Event Card - Dynamic */}
      {nextEvent ? (
        <div className="next-event-card">
          <div className="next-event-header">
            {/* <FaCalendarCheck className="next-event-icon" /> */}
            <span className="next-event-label">Next Event</span>
          </div>
          
          <div className="next-event-content">
            <h4 className="event-title">{nextEvent.meetingName || nextEvent.title}</h4>
            
            <div className="event-time">
              <FaClock className="event-icon" />
              <span className="time-badge">
                {formatTimeDisplay(nextEvent.startTime)} - {formatTimeDisplay(nextEvent.endTime)}
              </span>
            </div>
            
            {nextEvent.location && (
              <div className="event-location">
                <FaMapMarkerAlt className="event-icon" />
                <span>{nextEvent.location}</span>
              </div>
            )}
            
            {nextEvent.onlineLink && (
              <a href={nextEvent.onlineLink} className="event-link">
                <FaLink className="event-icon" />
                <span>{nextEvent.onlineLink}</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="no-event-card">
          <div className="no-event-content">
            <FaSmile className="celebration-icon" />
            <h3>No more events today</h3>
            <p>Enjoy your free time!</p>
          </div>
        </div>
      )}
    </aside>
  );
}