// src/component/Common/Topbar.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import "./Topbar.css";
import { useNotificationsContext } from "../../context/NotificationContext";
import { getNotificationLabel } from "../../utils/notificationService";

// ✅ Helper function to get user settings
const getUserSettings = () => {
  try {
    const settings = JSON.parse(localStorage.getItem("app_settings"));
    return settings || {};
  } catch {
    return {};
  }
};

export default function Topbar({
  title,
  createButtonLabel = "Create",
  onCreateClick,
  searchPlaceholder = "Search...",
  searchResults = [],
  onSearchChange,
  onSearchResultClick,
  commentsCount = 0,
  onCommentClick,
  currentUser,
  onLogout,
  onProfileClick,
  onSettingsClick,
  customActions,
}) {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());

  const { notifications: allNotifications, count: notificationCount } = useNotificationsContext();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  useEffect(() => {
    if (!activePanel) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest(".topbar-icon-wrap")) {
        setActivePanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activePanel]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const handleSearchResultClick = (item) => {
    setActivePanel(null);
    setSearchTerm("");
    if (onSearchResultClick) {
      onSearchResultClick(item);
    }
  };

  const getLabel = (diffMinutes) => {
    return getNotificationLabel(diffMinutes);
  };

  // ✅ Filter notifications based on settings
  const getFilteredNotifications = () => {
    const userSettings = getUserSettings();
    const meetingRemindersEnabled = userSettings.meetingReminders !== false;
    
    if (!meetingRemindersEnabled) {
      // If meeting reminders are disabled, only show non-calendar notifications
      return allNotifications.filter(n => n.source !== "calendar");
    }
    
    return allNotifications;
  };

  const filteredNotifications = getFilteredNotifications();
  const filteredCount = filteredNotifications.length;

  const notificationsWithTime = filteredNotifications.map((item) => ({
    ...item,
    label: getLabel(item.diffMinutes),
    displayTitle: `${item.sourceLabel}: ${item.title}`,
  }));

  const getUserDisplayName = () => {
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split("@")[0];
    return "My Account";
  };

  const getUserEmail = () => {
    if (currentUser?.email) return currentUser.email;
    return "Manage your profile";
  };

  return (
    <div className="topbar">
      <h1>{title}</h1>

      <div className="topbar-right">
        {onCreateClick && (
          <button className="topbar-create-btn" onClick={onCreateClick}>
            <span>+</span> {createButtonLabel}
          </button>
        )}

        <div className="topbar-icons">
          {/* SEARCH */}
          <div className="topbar-icon-wrap">
            <button
              className="topbar-icon-btn"
              onClick={() => togglePanel("search")}
              aria-label="Search"
            >
              <FaSearch />
            </button>

            {activePanel === "search" && (
              <div className="topbar-dropdown topbar-search-dropdown">
                <h4>Search</h4>
                <div className="topbar-search-input-wrap">
                  <input
                    type="text"
                    autoFocus
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>

                {searchTerm.trim() === "" && (
                  <div className="topbar-dropdown-empty">Type to search...</div>
                )}

                {searchTerm.trim() !== "" && searchResults.length === 0 && (
                  <div className="topbar-dropdown-empty">No results found</div>
                )}

                {searchResults.length > 0 && (
                  <div className="topbar-search-result-list">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="topbar-search-result-item"
                        onClick={() => handleSearchResultClick(item)}
                      >
                        <span>{item.title || item.meetingName || item.name}</span>
                        <span className="topbar-search-result-date">
                          {item.date || item.category || "Result"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="topbar-icon-wrap">
            <button
              className="topbar-icon-btn"
              onClick={() => togglePanel("notifications")}
              aria-label="Notifications"
            >
              <FaRegBell />
              {filteredNotifications.length > 0 && (
                <span className="topbar-icon-badge"></span>
              )}
            </button>

            {activePanel === "notifications" && (
              <div className="topbar-dropdown topbar-notification-dropdown">
                <h4>Notifications ({filteredCount})</h4>
                {notificationsWithTime.length === 0 ? (
                  <div className="topbar-dropdown-empty">No notifications</div>
                ) : (
                  <div className="topbar-search-result-list">
                    {notificationsWithTime.map((item) => (
                      <div
                        key={`${item.source}-${item.id}`}
                        className="topbar-search-result-item"
                        onClick={() => {
                          setActivePanel(null);
                          if (item.source === "calendar") {
                            navigate("/calendar");
                          } else if (item.source === "schedule") {
                            navigate("/appointment-schedule");
                          } else if (item.source === "workflows") {
                            navigate("/workflows");
                          }
                        }}
                      >
                        <div className="notification-item">
                          <span className="notification-title">{item.displayTitle}</span>
                          <span className="topbar-search-result-date">
                            {item.label || "Now"}
                          </span>
                          {item.date && (
                            <span className="notification-date">{item.date}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* COMMENTS */}
          <div className="topbar-icon-wrap">
            <button
              className="topbar-icon-btn"
              onClick={() => {
                togglePanel("comments");
                if (onCommentClick && activePanel !== "comments") {
                  onCommentClick();
                }
              }}
              aria-label="Comments"
            >
              <FaRegCommentDots />
              {commentsCount > 0 && <span className="topbar-icon-badge"></span>}
            </button>

            {activePanel === "comments" && (
              <div className="topbar-dropdown topbar-comment-dropdown">
                <h4>Comments</h4>
                <div className="topbar-dropdown-empty">
                  {commentsCount === 0 ? "No comments yet" : `${commentsCount} comments`}
                </div>
              </div>
            )}
          </div>

          {/* Custom Actions */}
          {customActions && (
            <div className="topbar-custom-actions">{customActions}</div>
          )}

          {/* PROFILE */}
          <div
            className="topbar-icon-wrap topbar-avatar-wrap"
            onClick={() => togglePanel("profile")}
          >
            <FaUserCircle className="topbar-avatar-icon" />
            <FaChevronDown className="topbar-avatar-chevron" />

            {activePanel === "profile" && (
              <div className="topbar-dropdown topbar-profile-dropdown">
                <div className="topbar-profile-dropdown-header">
                  <FaUserCircle className="topbar-profile-avatar" />
                  <div>
                    <h4>{getUserDisplayName()}</h4>
                    <span>{getUserEmail()}</span>
                  </div>
                </div>

                <div className="topbar-profile-menu">
                  <button
                    type="button"
                    className="topbar-profile-menu-item"
                    onClick={() => {
                      setActivePanel(null);
                      if (onProfileClick) onProfileClick();
                    }}
                  >
                    <FaUser /> Profile
                  </button>
                  <button
                    type="button"
                    className="topbar-profile-menu-item"
                    onClick={() => {
                      setActivePanel(null);
                      if (onSettingsClick) onSettingsClick();
                    }}
                  >
                    <FaCog /> Settings
                  </button>
                  <button
                    type="button"
                    className="topbar-profile-menu-item topbar-profile-menu-logout"
                    onClick={() => {
                      setActivePanel(null);
                      if (onLogout) onLogout();
                    }}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}