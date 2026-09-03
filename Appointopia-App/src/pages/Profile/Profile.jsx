import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaCalendarCheck,
  FaCamera,
  FaEdit,
  FaCheckCircle,
  FaSpinner,
  FaUserCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { auth, db } from "../../firebase/firebase";
import {
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChange } from "../../services/authService";
import "./profile.css";

const AVATAR_COLORS = [
  "#8755D5", "#16A6AD", "#FF7800", "#2F80D7",
  "#E84C8A", "#27AE60", "#F2C94C", "#4A56E2",
  "#E74C3C", "#1ABC9C", "#9B59B6", "#3498DB"
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

  //  Display values (jo UI mein dikhte hain)
  const [displayName, setDisplayName] = useState("");
  const [displayEmail, setDisplayEmail] = useState("");

  //  Form values (jo edit kar rahe hain)
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Auth guard with Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }
      const userName = user.name || user.displayName || "";
      const userEmail = user.email || "";
      
      setCurrentUser(user);
      
      //  Display values set karo
      setDisplayName(userName);
      setDisplayEmail(userEmail);
      
      //  Form values bhi same rakho
      setFormName(userName);
      setFormEmail(userEmail);
      
      setCheckingAuth(false);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Get meeting count from localStorage
  const getMeetingCount = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("calendar_meetings")) || [];
      return saved.length;
    } catch {
      return 0;
    }
  };

  // Get member since date with better formatting
  const getMemberSince = () => {
    let date = null;
    
    if (currentUser?.metadata?.creationTime) {
      date = new Date(currentUser.metadata.creationTime);
    } else if (currentUser?.createdAt) {
      date = new Date(currentUser.createdAt);
    }
    
    if (date && !isNaN(date.getTime())) {
      const options = { 
        month: 'long', 
        year: 'numeric',
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    }
    
    return "Member";
  };

  // Get member since year only for stat
  const getMemberSinceYear = () => {
    let date = null;
    
    if (currentUser?.metadata?.creationTime) {
      date = new Date(currentUser.metadata.creationTime);
    } else if (currentUser?.createdAt) {
      date = new Date(currentUser.createdAt);
    }
    
    if (date && !isNaN(date.getTime())) {
      return date.getFullYear();
    }
    
    return "2024";
  };

  const meetingCount = getMeetingCount();
  const memberSince = getMemberSince();
  const memberSinceYear = getMemberSinceYear();

  //  Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedMessage("");
    setIsSaving(true);

    const trimmedEmail = formEmail.trim().toLowerCase();
    const trimmedName = formName.trim();

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

      // Update display name in Firebase Auth
      if (trimmedName !== user.displayName) {
        await updateProfile(user, {
          displayName: trimmedName,
        });
      }

      // Update email in Firebase Auth
      if (trimmedEmail !== user.email) {
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

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: trimmedName,
        email: trimmedEmail,
        updatedAt: serverTimestamp(),
      });

      // Update localStorage for app state
      const userData = {
        uid: user.uid,
        name: trimmedName,
        email: trimmedEmail,
        displayName: trimmedName,
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      //  CRITICAL: Display values update karo (UI update)
      setDisplayName(trimmedName);
      setDisplayEmail(trimmedEmail);

      //  CurrentUser bhi update karo
      setCurrentUser((prev) => ({
        ...prev,
        name: trimmedName,
        email: trimmedEmail,
        displayName: trimmedName,
      }));

      //  Form values bhi update karo (taaki edit mode mein bhi sahi rahe)
      setFormName(trimmedName);
      setFormEmail(trimmedEmail);

      setSavedMessage("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
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

  //  Handle edit toggle
  const toggleEdit = () => {
    if (isEditing) {
      //  Cancel: Form values ko display values pe reset karo
      setFormName(displayName);
      setFormEmail(displayEmail);
      setErrors({});
      setSavedMessage("");
    } else {
      //  Edit mode: Form values ko current display values se fill karo
      setFormName(displayName);
      setFormEmail(displayEmail);
      setErrors({});
      setSavedMessage("");
    }
    setIsEditing(!isEditing);
  };

  if (checkingAuth || loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  //  Display ke liye initials aur color (displayName se)
  const displayInitials = getInitials(displayName || displayEmail || currentUser?.displayName || "User");
  const displayAvatarColor = getColorFromText(displayEmail || currentUser?.email || "user");

  return (
    <div className="profile-page">
      {/* Topbar */}
      <div className="profile-topbar">
        <button className="profile-back-btn" onClick={() => navigate("/calendar")}>
          <FaArrowLeft /> <span>Back to Calendar</span>
        </button>
        <h1>My Profile</h1>
      </div>

      {/* Content */}
      <div className="profile-content">
        <div className="profile-card">
          {/* Avatar Section -  Display values se show ho raha hai */}
          <div className="profile-avatar-section">
            <div className="profile-avatar-big" style={{ backgroundColor: displayAvatarColor }}>
              {displayInitials}
              <div className="profile-avatar-badge">
                <FaCamera />
              </div>
            </div>
            <div className="profile-user-info">
              <h2>{displayName || displayEmail?.split("@")[0] || "User"}</h2>
              <span className="profile-subtext">
                <FaEnvelope className="profile-subtext-icon" />
                {displayEmail || currentUser?.email}
              </span>
              <span className="profile-subtext profile-subtext-joined">
                <FaClock className="profile-subtext-icon" />
                Joined {memberSince}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="profile-stats-row">
            <div className="profile-stat">
              <div className="profile-stat-icon-wrapper meetings">
                <FaCalendarCheck className="profile-stat-icon" />
              </div>
              <div>
                <strong>{meetingCount}</strong>
                <span>Meetings</span>
              </div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-icon-wrapper member">
                <FaUser className="profile-stat-icon" />
              </div>
              <div>
                <strong>{memberSinceYear}</strong>
                <span>Member since</span>
              </div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-icon-wrapper growth">
                <FaChartLine className="profile-stat-icon" />
              </div>
              <div>
                <strong>Active</strong>
                <span>Account status</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {!isEditing && (
            <button className="profile-edit-btn" onClick={toggleEdit}>
              <FaEdit /> Edit Profile
            </button>
          )}

          {/* Form -  Form values se show ho raha hai */}
          {isEditing && (
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="profile-form-group">
                <label>Full Name</label>
                <div className="profile-input-icon">
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={isSaving}
                    className={errors.name ? "input-error" : ""}
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
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? "input-error" : ""}
                    disabled={isSaving}
                  />
                  <FaEnvelope />
                </div>
                {errors.email && <span className="profile-error-text">{errors.email}</span>}
              </div>

              {savedMessage && (
                <div className="profile-success-message">
                  <FaCheckCircle className="profile-success-icon" />
                  <span>{savedMessage}</span>
                </div>
              )}

              <div className="profile-form-actions">
                <button 
                  type="button" 
                  className="profile-cancel-btn" 
                  onClick={toggleEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-save-btn" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <FaSpinner className="profile-spinner" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}