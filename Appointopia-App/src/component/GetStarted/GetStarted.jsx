import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import profile1 from "../../assets/hero/A1.jpg";
import profile2 from "../../assets/hero/j1.jpg";
import profile3 from "../../assets/hero/B1.jpg";
import "./getstarted.css";

export default function GetStarted() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Function to check user
  const checkUser = () => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);
      } catch (error) {
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  };

  // ✅ Check user on mount
  useEffect(() => {
    checkUser();
  }, []);

  // ✅ Check user whenever route changes (login/logout navigation)
  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  // ✅ Listen for storage changes (when user logs in/out from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Listen for custom events
  useEffect(() => {
    const handleUserChange = () => {
      checkUser();
    };

    window.addEventListener("userLoggedOut", handleUserChange);
    window.addEventListener("userLoggedIn", handleUserChange);
    
    return () => {
      window.removeEventListener("userLoggedOut", handleUserChange);
      window.removeEventListener("userLoggedIn", handleUserChange);
    };
  }, []);

  return (
    <section className="get-started">
      <div className="cta-top-shape"></div>
      <div className="cta-bottom-shape"></div>

      <img src={profile1} alt="" className="cta-profile cta-profile-one" />
      <img src={profile2} alt="" className="cta-profile cta-profile-two" />
      <img src={profile3} alt="" className="cta-profile cta-profile-three" />

      <div className="get-started-content">
        <h2>Get started</h2>

        <p>
          Utilize digital calendars or scheduling apps to keep track of your
          appointments, deadlines, and events. These tools often offer reminders
          and can sync across multiple devices, ensuring you stay on top of your schedule
        </p>

        {currentUser ? (
          <Link to="/calendar">
            <button className="cta-calendar-btn">Go to Calendar</button>
          </Link>
        ) : (
          <Link to="/signup">
            <button className="cta-signup-btn">Sign up</button>
          </Link>
        )}
      </div>
    </section>
  );
}