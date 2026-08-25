// src/component/Sidebar/Sidebar.jsx
import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaLink,
  FaSmile,
  FaUserFriends,
  FaChevronDown,
  FaChevronUp,
  FaEnvelope,
  FaCalendarCheck,
  FaMapPin,
  FaTimes,
  FaBars
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

// ✅ Avatar colors
const AVATAR_COLORS = [
    '#8755D5', '#16A6AD', '#FF7800', '#2F80D7', 
    '#E84C8A', '#27AE60', '#F2C94C', '#4A56E2',
    '#E74C3C', '#1ABC9C', '#9B59B6', '#3498DB'
];

const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
};

const getColorFromName = (name) => {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default function Sidebar({ events = [], selectedDate = new Date() }) {
  const location = useLocation();
  const [nextEvent, setNextEvent] = useState(null);
  const [showAllInvitees, setShowAllInvitees] = useState(false);
  
  // ✅ State for selected invitee popup
  const [selectedInvitee, setSelectedInvitee] = useState(null);

  // ✅ Mobile sidebar toggle
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const memoizedEvents = useMemo(() => events, [events]);
  const memoizedDate = useMemo(() => selectedDate, [selectedDate]);

  // ✅ Get meeting count for a specific invitee (DYNAMIC)
  const getMeetingCount = (email) => {
    if (!email || !events || events.length === 0) return 0;
    
    let count = 0;
    events.forEach(event => {
      if (event.invitees && Array.isArray(event.invitees)) {
        const found = event.invitees.some(
          invitee => invitee.email?.toLowerCase() === email.toLowerCase()
        );
        if (found) count++;
      }
    });
    return count;
  };

  // Calculate next event
  useEffect(() => {
    if (memoizedEvents && memoizedEvents.length > 0 && memoizedDate) {
      const next = getNextEvent(memoizedEvents, memoizedDate);
      setNextEvent(next);
    } else {
      setNextEvent(null);
    }
  }, [memoizedEvents, memoizedDate]);

  // Reset expand when event changes
  useEffect(() => {
    setShowAllInvitees(false);
    setSelectedInvitee(null);
  }, [nextEvent]);

  // ✅ Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // ✅ Close mobile sidebar on window resize (desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobileOpen) return;
    
    const handleClickOutside = (e) => {
      const sidebar = document.querySelector('.sidebar');
      const toggleBtn = document.querySelector('.sidebar-mobile-toggle');
      
      if (sidebar && !sidebar.contains(e.target) && toggleBtn && !toggleBtn.contains(e.target)) {
        setIsMobileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileOpen]);

  const getInvitees = (event) => {
    if (event.invitees && event.invitees.length > 0) {
      return event.invitees;
    }
    if (event.meetingName) {
      return [
        { 
          name: event.meetingName, 
          initials: getInitials(event.meetingName),
          email: null,
          avatarColor: getColorFromName(event.meetingName)
        }
      ];
    }
    return [];
  };

  const toggleExpandInvitees = () => {
    setShowAllInvitees(!showAllInvitees);
  };

  // ✅ Handle invitee click - Show profile card with DYNAMIC data
  const handleInviteeClick = (person, e) => {
    e.stopPropagation();
    
    const name = person.name || person;
    const email = person.email || null;
    const avatarColor = person.avatarColor || getColorFromName(name);
    const initials = person.initials || getInitials(name);
    const meetingCount = email ? getMeetingCount(email) : 0;
    
    setSelectedInvitee({
      id: person.id || Date.now(),
      name,
      email,
      avatarColor,
      initials,
      location: person.location || "Location not set",
      joinedDate: person.joinedDate || new Date().getFullYear(),
      meetingCount
    });
  };

  // ✅ Close profile card
  const closeProfileCard = () => {
    setSelectedInvitee(null);
  };

  // ✅ Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // ✅ Render invitee avatar with click handler
  const renderInviteeAvatar = (person, index) => {
    const name = person.name || person;
    const color = person.avatarColor || getColorFromName(name);
    const initials = person.initials || getInitials(name);
    
    return (
      <div 
        key={index} 
        className="invitee-avatar-circle clickable"
        style={{ backgroundColor: color }}
        title={`Click to view ${name}'s profile`}
        onClick={(e) => handleInviteeClick(person, e)}
      >
        {initials}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileOpen && (
        <button
          className="sidebar-mobile-toggle"
          onClick={toggleMobileSidebar}
          aria-label="Open sidebar"
        >
          <FaBars />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${isMobileOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" className="sidebar-link" onClick={() => setIsMobileOpen(false)}>
            <div className="logo-icon">
              <img src={logo} alt="Appointopia" />
              <span>Appointopia</span>
            </div>
          </Link>
          <button
            className="sidebar-close-mobile"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu */}
        <nav className="sidebar-menu">
          {menuItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(path);
            return (
              <Link to={path} key={path} className="sidebar-link" onClick={() => setIsMobileOpen(false)}>
                <div className={isActive ? "sidebar-item-active" : "sidebar-item"}>
                  <Icon className="sidebar-icon" />
                  <span>{label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Next Event Card */}
        {nextEvent ? (
          <div className="next-event-card">
            <div className="next-event-header">
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

              {/* INVITEES SECTION */}
              {(() => {
                const invitees = getInvitees(nextEvent);
                if (invitees.length === 0) return null;
                
                const displayInvitees = showAllInvitees 
                    ? invitees 
                    : invitees.slice(0, 4);
                
                const hasMore = invitees.length > 4;
                
                return (
                  <div className="event-invitees">
                    <div className="invitees-header">
                      <FaUserFriends className="invitees-icon" />
                      <span className="invitees-label">
                        {invitees.length} Invitee{invitees.length > 1 ? 's' : ''}
                      </span>
                      {hasMore && (
                        <button 
                          className="invitees-toggle-btn"
                          onClick={toggleExpandInvitees}
                        >
                          {showAllInvitees ? (
                            <><FaChevronUp /> Show less</>
                          ) : (
                            <><FaChevronDown /> Show all</>
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Row 1 - First 4 invitees */}
                    <div className="invitees-avatars-row">
                      {displayInvitees.slice(0, 4).map((person, index) => 
                        renderInviteeAvatar(person, index)
                      )}
                      {!showAllInvitees && hasMore && (
                        <div 
                          className="invitee-more-clickable"
                          onClick={toggleExpandInvitees}
                        >
                          +{invitees.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Row 2 - Remaining invitees */}
                    {showAllInvitees && invitees.length > 4 && (
                      <div className="invitees-avatars-row expanded-row">
                        {invitees.slice(4).map((person, index) => 
                          renderInviteeAvatar(person, index + 4)
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
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

        {/* ✅ INVITEE PROFILE CARD - POPUP with DYNAMIC DATA */}
        {selectedInvitee && (
          <div className="invitee-profile-overlay" onClick={closeProfileCard}>
            <div className="invitee-profile-card" onClick={(e) => e.stopPropagation()}>
              <button className="profile-close-btn" onClick={closeProfileCard}>
                <FaTimes />
              </button>
              
              <div className="profile-header">
                <div 
                  className="profile-avatar-large"
                  style={{ backgroundColor: selectedInvitee.avatarColor }}
                >
                  {selectedInvitee.initials}
                </div>
                <div className="profile-name-section">
                  <h3>{selectedInvitee.name}</h3>
                  <span className="profile-email">
                    <FaEnvelope className="profile-icon" />
                    {selectedInvitee.email || "No email provided"}
                  </span>
                </div>
              </div>

              <div className="profile-divider"></div>

              <div className="profile-details">
                <div className="profile-detail-item">
                  <FaCalendarCheck className="profile-detail-icon" />
                  <span>{selectedInvitee.meetingCount || 0} meetings with {selectedInvitee.name}</span>
                </div>
                <div className="profile-detail-item">
                  <FaMapPin className="profile-detail-icon" />
                  <span>{selectedInvitee.location || "Location not set"}</span>
                </div>
                <div className="profile-detail-item">
                  <FaUserFriends className="profile-detail-icon" />
                  <span>Joined {selectedInvitee.joinedDate || "recently"}</span>
                </div>
              </div>

              <button className="profile-view-btn">
                View Full Profile
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}