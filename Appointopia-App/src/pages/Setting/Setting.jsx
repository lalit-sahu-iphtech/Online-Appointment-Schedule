// src/component/Settings/Settings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaCalendarAlt,
  FaMoon,
  FaTrashAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import "./setting.css";

const DEFAULT_SETTINGS = {
  emailReminders: true,
  meetingReminders: true,
  defaultView: "week",
  darkMode: false,
};

export default function Settings() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Auth guard - same pattern as Calendar.jsx
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/signin");
      return;
    }
    try {
      setCurrentUser(JSON.parse(stored));
    } catch (error) {
      console.error("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate]);

  // Saved preferences load karo
  useEffect(() => {
    const saved = localStorage.getItem("app_settings");
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (error) {
        console.error("Invalid app_settings in storage:", error);
      }
    }
  }, []);

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewChange = (view) => {
    setSettings((prev) => ({ ...prev, defaultView: view }));
  };

  const handleSave = () => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setSavedMessage("Settings saved!");
    setTimeout(() => setSavedMessage(""), 2200);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
  };

  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.filter((u) => u.id !== currentUser.id);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("currentUser");
    localStorage.removeItem("calendar_meetings");
    localStorage.removeItem("app_settings");
    navigate("/signup");
  };

  if (checkingAuth) return null;

  return (
    <div className="settings-page">
      <div className="settings-topbar">
        <button className="settings-back-btn" onClick={() => navigate("/calendar")}>
          <FaArrowLeft /> <span>Back to Calendar</span>
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">

        {/* NOTIFICATIONS */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaBell className="settings-card-icon" />
            <h3>Notifications</h3>
          </div>

          <div className="settings-row">
            <div>
              <strong>Meeting reminders</strong>
              <span>Get notified before a meeting starts</span>
            </div>
            <button
              type="button"
              className={`settings-toggle ${settings.meetingReminders ? "on" : ""}`}
              onClick={() => toggleSetting("meetingReminders")}
              aria-pressed={settings.meetingReminders}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>Email reminders</strong>
              <span>Receive meeting summaries by email</span>
            </div>
            <button
              type="button"
              className={`settings-toggle ${settings.emailReminders ? "on" : ""}`}
              onClick={() => toggleSetting("emailReminders")}
              aria-pressed={settings.emailReminders}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        {/* CALENDAR PREFERENCES */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaCalendarAlt className="settings-card-icon" />
            <h3>Calendar</h3>
          </div>

          <div className="settings-row settings-row-column">
            <div>
              <strong>Default view</strong>
              <span>Which view opens when you visit the calendar</span>
            </div>
            <div className="settings-segmented">
              {["day", "week", "month"].map((view) => (
                <button
                  key={view}
                  type="button"
                  className={settings.defaultView === view ? "active" : ""}
                  onClick={() => handleViewChange(view)}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* APPEARANCE */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaMoon className="settings-card-icon" />
            <h3>Appearance</h3>
          </div>

          <div className="settings-row">
            <div>
              <strong>Dark mode</strong>
              <span>Switch to a darker color theme</span>
            </div>
            <button
              type="button"
              className={`settings-toggle ${settings.darkMode ? "on" : ""}`}
              onClick={() => toggleSetting("darkMode")}
              aria-pressed={settings.darkMode}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        {savedMessage && <p className="settings-success-text">{savedMessage}</p>}

        <button className="settings-save-btn" onClick={handleSave}>
          Save Settings
        </button>

        {/* ACCOUNT ACTIONS */}
        <div className="settings-card settings-danger-card">
          <div className="settings-card-header">
            <FaTrashAlt className="settings-card-icon settings-danger-icon" />
            <h3>Danger Zone</h3>
          </div>

          <div className="settings-row">
            <div>
              <strong>Sign out</strong>
              <span>Log out of your Appointopia account</span>
            </div>
            <button type="button" className="settings-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>Delete account</strong>
              <span>
                {confirmDelete
                  ? "Click again to permanently delete your account and meetings"
                  : "This will permanently remove your account and all meetings"}
              </span>
            </div>
            <button
              type="button"
              className="settings-delete-btn"
              onClick={handleDeleteAccount}
            >
              {confirmDelete ? "Confirm Delete" : "Delete Account"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}