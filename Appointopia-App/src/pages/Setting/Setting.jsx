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
  FaSun,
  FaUser,
  FaEnvelope,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { auth, db } from "../../firebase/firebase";
import {
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { onAuthStateChange } from "../../services/authService";
import "./setting.css";

// Default settings
const DEFAULT_SETTINGS = {
  emailReminders: true,
  meetingReminders: true,
  defaultView: "week",
  darkMode: false,
  language: "en",
  timezone: "Asia/Kolkata",
  emailNotifications: true,
  pushNotifications: true,
};

export default function Settings() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [darkModeActive, setDarkModeActive] = useState(false);

  // Auth guard with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      setCurrentUser(user);
      setCheckingAuth(false);
      setLoading(false);

      // Check dark mode from localStorage on load
      const savedDarkMode = localStorage.getItem("darkMode") === "true";
      setDarkModeActive(savedDarkMode);
      if (savedDarkMode) {
        document.body.classList.add("dark-mode");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!currentUser?.uid) return;
      
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.settings) {
            const loadedSettings = { ...DEFAULT_SETTINGS, ...userData.settings };
            setSettings(loadedSettings);
            
            // Apply dark mode from settings
            if (loadedSettings.darkMode) {
              document.body.classList.add("dark-mode");
              localStorage.setItem("darkMode", "true");
              setDarkModeActive(true);
            }
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    if (currentUser?.uid) {
      loadSettings();
    }
  }, [currentUser]);

  // Toggle setting with side effects
  const toggleSetting = (key) => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));

    // Apply dark mode immediately
    if (key === "darkMode") {
      if (newValue) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkMode", "true");
        setDarkModeActive(true);
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
        setDarkModeActive(false);
      }
    }
  };

  const handleViewChange = (view) => {
    setSettings((prev) => ({ ...prev, defaultView: view }));
  };

  // Save settings to Firestore
  const handleSave = async () => {
    if (!currentUser?.uid) return;
    setSaving(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        settings: settings,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Save to localStorage
      localStorage.setItem("app_settings", JSON.stringify(settings));
      localStorage.setItem("darkMode", String(settings.darkMode));
      
      setSavedMessage("Settings saved successfully!");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSavedMessage(" Failed to save settings. Please try again.");
      setTimeout(() => setSavedMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  //  Logout with Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("app_settings");
      localStorage.removeItem("darkMode");
      document.body.classList.remove("dark-mode");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      setSavedMessage(" Failed to logout. Please try again.");
      setTimeout(() => setSavedMessage(""), 3000);
    }
  };

  // Delete account with Firebase
  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }

    if (!currentUser?.uid) {
      setSavedMessage("No user found");
      return;
    }

    setIsDeleting(true);

    try {
      // Delete user data from Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef);

      // Delete user from Firebase Auth
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }

      // Clear localStorage
      localStorage.clear();
      document.body.classList.remove("dark-mode");

      navigate("/signup");
    } catch (error) {
      console.error("Delete account error:", error);
      
      if (error.code === "auth/requires-recent-login") {
        setSavedMessage("⚠️ For security, please sign out and sign in again before deleting your account.");
        setTimeout(() => setSavedMessage(""), 5000);
      } else {
        setSavedMessage(`Failed to delete account: ${error.message || "Please try again."}`);
        setTimeout(() => setSavedMessage(""), 5000);
      }
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (checkingAuth || loading) {
    return (
      <div className="settings-page">
        <div className="settings-loading-container">
          <FaSpinner className="settings-loading-spinner" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`settings-page ${darkModeActive ? "dark-mode" : ""}`}>
      <div className="settings-topbar">
        <button className="settings-back-btn" onClick={() => navigate("/calendar")}>
          <FaArrowLeft /> <span>Back to Calendar</span>
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-content">

        {/* ✅ PROFILE SECTION */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaUser className="settings-card-icon" />
            <h3>Profile</h3>
          </div>
          <div className="settings-row">
            <div>
              <strong>{currentUser?.displayName || "User"}</strong>
              <span>{currentUser?.email}</span>
            </div>
            <button className="settings-edit-profile-btn" onClick={() => navigate("/profile")}>
              Edit Profile
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="settings-card">
          <div className="settings-card-header">
            <FaBell className="settings-card-icon" />
            <h3>Notifications</h3>
          </div>

          <div className="settings-row">
            <div>
              <strong> Meeting reminders</strong>
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

          <div className="settings-row">
            <div>
              <strong>Push notifications</strong>
              <span>Receive push notifications on your device</span>
            </div>
            <button
              type="button"
              className={`settings-toggle ${settings.pushNotifications !== false ? "on" : ""}`}
              onClick={() => toggleSetting("pushNotifications")}
              aria-pressed={settings.pushNotifications !== false}
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

          <div className="settings-row settings-row-column">
            <div>
              <strong>Timezone</strong>
              <span>Your current timezone</span>
            </div>
            <select 
              className="settings-select"
              value={settings.timezone || "Asia/Kolkata"}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (UTC +5:30)</option>
              <option value="America/New_York">America/New York (UTC -5:00)</option>
              <option value="America/Los_Angeles">America/Los Angeles (UTC -8:00)</option>
              <option value="Europe/London">Europe/London (UTC +0:00)</option>
              <option value="Europe/Paris">Europe/Paris (UTC +1:00)</option>
              <option value="Asia/Dubai">Asia/Dubai (UTC +4:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (UTC +8:00)</option>
              <option value="Australia/Sydney">Australia/Sydney (UTC +11:00)</option>
            </select>
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
              <strong>{settings.darkMode ? "Dark mode" : "Light mode"}</strong>
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

          <div className="settings-row settings-row-column">
            <div>
              <strong>Language</strong>
              <span>Choose your preferred language</span>
            </div>
            <select 
              className="settings-select"
              value={settings.language || "en"}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
        </div>

        {/* ✅ SAVE STATUS */}
        {savedMessage && (
          <div className={`settings-status-message ${savedMessage.includes("✅") ? "success" : savedMessage.includes("❌") ? "error" : "warning"}`}>
            {savedMessage}
          </div>
        )}

        <button 
          className="settings-save-btn" 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <FaSpinner className="settings-spinner" /> Saving...
            </>
          ) : (
            <>
              <FaCheckCircle /> Save Settings
            </>
          )}
        </button>

        {/* ACCOUNT ACTIONS */}
        <div className="settings-card settings-danger-card">
          <div className="settings-card-header">
            <FaTrashAlt className="settings-card-icon settings-danger-icon" />
            <h3> Danger Zone</h3>
          </div>

          <div className="settings-row">
            <div>
              <strong> Sign out</strong>
              <span>Log out of your Appointopia account</span>
            </div>
            <button type="button" className="settings-logout-btn" onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong> Delete account</strong>
              <span className={confirmDelete ? "settings-delete-warning" : ""}>
                {confirmDelete
                  ? "⚠️ Click again to permanently delete your account and all data"
                  : "This will permanently remove your account and all associated data"}
              </span>
            </div>
            <button
              type="button"
              className={`settings-delete-btn ${confirmDelete ? "confirm" : ""}`}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <FaSpinner className="settings-spinner" /> Deleting...
                </>
              ) : confirmDelete ? (
                "⚠️ Confirm Delete"
              ) : (
                "Delete Account"
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}