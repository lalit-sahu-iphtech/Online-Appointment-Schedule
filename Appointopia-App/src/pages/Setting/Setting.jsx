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
import { auth, db } from "../../firebase/firebase";
import {
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChange } from "../../services/authService";
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
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedMessage, setSavedMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Auth guard with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      setCurrentUser(user);
      setCheckingAuth(false);
      setLoading(false);
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
            setSettings({ ...DEFAULT_SETTINGS, ...userData.settings });
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

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleViewChange = (view) => {
    setSettings((prev) => ({ ...prev, defaultView: view }));
  };

  // ✅ Save settings to Firestore
  const handleSave = async () => {
    if (!currentUser?.uid) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, {
        settings: settings,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Also save to localStorage for quick access
      localStorage.setItem("app_settings", JSON.stringify(settings));
      
      setSavedMessage("Settings saved successfully!");
      setTimeout(() => setSavedMessage(""), 2200);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSavedMessage("Failed to save settings. Please try again.");
      setTimeout(() => setSavedMessage(""), 2200);
    }
  };

  // ✅ Logout with Firebase
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("app_settings");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  // ✅ Delete account with Firebase
  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    if (!currentUser?.uid) {
      alert("No user found");
      return;
    }

    setIsDeleting(true);

    try {
      // ✅ Delete user data from Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await deleteDoc(userRef);

      // ✅ Delete user from Firebase Auth
      const user = auth.currentUser;
      if (user) {
        await deleteUser(user);
      }

      // ✅ Clear localStorage
      localStorage.removeItem("currentUser");
      localStorage.removeItem("app_settings");
      localStorage.removeItem("calendar_meetings");

      navigate("/signup");
    } catch (error) {
      console.error("Delete account error:", error);
      
      // ✅ If user needs reauthentication
      if (error.code === "auth/requires-recent-login") {
        alert("For security, please sign out and sign in again before deleting your account.");
      } else {
        alert(`Failed to delete account: ${error.message || "Please try again."}`);
      }
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (checkingAuth || loading) {
    return <div className="settings-loading">Loading...</div>;
  }

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
                  ? "Click again to permanently delete your account and all data"
                  : "This will permanently remove your account and all associated data"}
              </span>
            </div>
            <button
              type="button"
              className="settings-delete-btn"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : confirmDelete ? "Confirm Delete" : "Delete Account"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}