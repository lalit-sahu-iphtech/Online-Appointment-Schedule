// src/component/Navbar/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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

  // ✅ Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Handle Logout - Dispatch event
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    
    // ✅ Dispatch custom event so GetStarted updates
    window.dispatchEvent(new Event("userLoggedOut"));
    
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link">
        <div className="nav-left">
          <h1>Appointopia</h1>
        </div>
      </Link>

      <div className="nav-mid">
        <ul>
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/resource">Resource</Link></li>
          <li><Link to="/company">Company</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
        </ul>
      </div>

      <div className="nav-right">
        {currentUser ? (
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            Logout
          </button>
        ) : (
          <>
            <Link to="/signin" className="sign-in-btn">Sign in</Link>
            <Link to="/signup" className="sign-up-btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}