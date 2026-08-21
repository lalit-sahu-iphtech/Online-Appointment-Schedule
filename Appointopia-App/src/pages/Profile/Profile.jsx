// src/component/Profile/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaCalendarCheck,
  FaCamera,
} from "react-icons/fa";
import "./profile.css";

const AVATAR_COLORS = [
  "#8755D5", "#16A6AD", "#FF7800", "#2F80D7",
  "#E84C8A", "#27AE60", "#F2C94C", "#4A56E2",
];

const getInitials = (text) => {
  if (!text) return "?";
  return text
    .split(/[\s@.]+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getColorFromText = (text) => {
  if (!text) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export default function Profile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  // Auth guard - same pattern as Calendar.jsx
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/signin");
      return;
    }
    try {
      const user = JSON.parse(stored);
      setCurrentUser(user);
      setName(user.name || "");
      setEmail(user.email || "");
    } catch (error) {
      console.error("Invalid currentUser in storage:", error);
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate]);

  const meetingCount = (() => {
    try {
      const saved = JSON.parse(localStorage.getItem("calendar_meetings")) || [];
      return saved.length;
    } catch {
      return 0;
    }
  })();

  const memberSince = currentUser?.id
    ? new Date(Number(currentUser.id)).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    const newErrors = {};
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    // Agar email badla hai to check karo koi doosra account us email se already nahi hai
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailTaken = users.some(
      (u) => u.email === trimmedEmail && u.id !== currentUser.id
    );
    if (emailTaken) {
      setErrors({ email: "This email is already in use" });
      return;
    }

    const updatedUser = { ...currentUser, name: trimmedName, email: trimmedEmail };

    const updatedUsers = users.map((u) =>
      u.id === currentUser.id ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    setCurrentUser(updatedUser);
    setSavedMessage("Profile updated successfully!");
    setTimeout(() => setSavedMessage(""), 2500);
    
    navigate(-1);
  
  };

  if (checkingAuth) return null;

  const initials = getInitials(name || email);
  const avatarColor = getColorFromText(email);

  return (
    <div className="profile-page">
      <div className="profile-topbar">
        <button className="profile-back-btn" onClick={() => navigate("/calendar")}>
          <FaArrowLeft /> Back to Calendar
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">

          <div className="profile-avatar-section">
            <div className="profile-avatar-big" style={{ backgroundColor: avatarColor }}>
              {initials}
              <div className="profile-avatar-badge">
                <FaCamera />
              </div>
            </div>
            <div>
              <h2>{name || email.split("@")[0]}</h2>
              <span className="profile-subtext">{email}</span>
            </div>
          </div>

          <div className="profile-stats-row">
            <div className="profile-stat">
              <FaCalendarCheck className="profile-stat-icon" />
              <div>
                <strong>{meetingCount}</strong>
                <span>Meetings</span>
              </div>
            </div>
            <div className="profile-stat">
              <FaUser className="profile-stat-icon" />
              <div>
                <strong>{memberSince}</strong>
                <span>Member since</span>
              </div>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label>Full Name</label>
              <div className="profile-input-icon">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
                <FaUser />
              </div>
            </div>

            <div className="profile-form-group">
              <label>Email Address</label>
              <div className="profile-input-icon">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? "input-error" : ""}
                />
                <FaEnvelope />
              </div>
              {errors.email && <span className="profile-error-text">{errors.email}</span>}
            </div>

            {savedMessage && <p className="profile-success-text">{savedMessage}</p>}

            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}