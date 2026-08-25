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
import { auth, db } from "../../firebase/firebase";
import {
  updateProfile,
  updateEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChange, getCurrentUserData } from "../../services/authService";
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
  const [loading, setLoading] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Auth guard with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      setCurrentUser(user);
      setName(user.name || user.displayName || "");
      setEmail(user.email || "");
      setCheckingAuth(false);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Get meeting count from Firestore or localStorage
  const getMeetingCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("calendar_meetings")) || [];
      return saved.length;
    } catch {
      return 0;
    }
  };

  // ✅ Get member since date
  const getMemberSince = () => {
    if (currentUser?.metadata?.creationTime) {
      const date = new Date(currentUser.metadata.creationTime);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    if (currentUser?.createdAt) {
      const date = new Date(currentUser.createdAt);
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    return "—";
  };

  const meetingCount = getMeetingCount();
  const memberSince = getMemberSince();

  // ✅ Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedMessage("");
    setIsSaving(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Validation
    const newErrors = {};
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!trimmedName) {
      newErrors.name = "Name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }
    setErrors({});

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user logged in");
      }

      // ✅ Update display name in Firebase Auth
      if (trimmedName !== user.displayName) {
        await updateProfile(user, {
          displayName: trimmedName,
        });
      }

      // ✅ Update email in Firebase Auth (requires reauthentication)
      if (trimmedEmail !== user.email) {
        // Note: For email change, user needs to reauthenticate
        // For simplicity, we're updating Firestore but not Auth email
        // In production, use reauthenticateWithCredential
        try {
          await updateEmail(user, trimmedEmail);
        } catch (emailError) {
          if (emailError.code === "auth/requires-recent-login") {
            setErrors({
              email: "Please sign out and sign in again to change email",
            });
            setIsSaving(false);
            return;
          }
          throw emailError;
        }
      }

      // ✅ Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: trimmedName,
        email: trimmedEmail,
        updatedAt: serverTimestamp(),
      });

      // ✅ Update localStorage for app state
      const userData = {
        uid: user.uid,
        name: trimmedName,
        email: trimmedEmail,
        displayName: trimmedName,
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // ✅ Update currentUser state
      setCurrentUser((prev) => ({
        ...prev,
        name: trimmedName,
        email: trimmedEmail,
        displayName: trimmedName,
      }));

      setSavedMessage("Profile updated successfully!");
      setTimeout(() => {
        navigate(-1);
      }, 1000)
    } catch (error) {
      console.error("Error updating profile:", error);
      let errorMessage = "Something went wrong. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account.";
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please sign out and sign in again to change email.";
      }
      setErrors({ email: errorMessage });
    } finally {
      setIsSaving(false);
    }
  };

  if (checkingAuth || loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  const initials = getInitials(name || email || currentUser?.displayName || "User");
  const avatarColor = getColorFromText(email || currentUser?.email || "user");

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
              <h2>{name || currentUser?.displayName || email?.split("@")[0] || "User"}</h2>
              <span className="profile-subtext">{email || currentUser?.email}</span>
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
                  disabled={isSaving}
                />
                <FaUser />
              </div>
              {errors.name && <span className="profile-error-text">{errors.name}</span>}
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
                  disabled={isSaving}
                />
                <FaEnvelope />
              </div>
              {errors.email && <span className="profile-error-text">{errors.email}</span>}
            </div>

            {savedMessage && <p className="profile-success-text">{savedMessage}</p>}

            <button type="submit" className="profile-save-btn" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}