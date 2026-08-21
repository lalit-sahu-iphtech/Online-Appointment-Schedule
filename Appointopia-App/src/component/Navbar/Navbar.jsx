// src/component/Navbar/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setCurrentUser(user);
      } catch (error) {
        console.error("Invalid user data:", error);
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
  }, []);

  // ✅ Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
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

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <Link to="/" className="logo-link">
        <div className="nav-left">
          <h1>Appointopia</h1>
        </div>
      </Link>

      {/* Navigation - All Links */}
      <div className="nav-mid">
        <ul>
          <li><Link to="/product">Product</Link></li>
          <li><Link to="/resource">Resource</Link></li>
          <li><Link to="/company">Company</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
        </ul>
      </div>

      {/* Auth Buttons - Conditional Rendering */}
      <div className="nav-right">
        {currentUser ? (
          // ✅ User is logged in - Show Logout
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            Logout
          </button>
        ) : (
          // ✅ User is NOT logged in - Show Sign in & Sign up
          <>
            <Link to="/signin" className="sign-in-btn">Sign in</Link>
            <Link to="/signup" className="sign-up-btn">Sign up</Link>
          </>
        )}
      </div>

    </nav>
  );
}