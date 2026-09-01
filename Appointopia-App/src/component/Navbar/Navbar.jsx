// src/component/Navbar/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import "./navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  // ✅ Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // ✅ Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-link" onClick={handleLinkClick}>
        <div className="nav-left">
          <h1>Appointopia</h1>
        </div>
      </Link>

      {/* Desktop Navigation */}
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

      {/* Mobile Menu Toggle Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <ul className="mobile-nav-links">
            <li><Link to="/product" onClick={handleLinkClick}>Product</Link></li>
            <li><Link to="/resource" onClick={handleLinkClick}>Resource</Link></li>
            <li><Link to="/company" onClick={handleLinkClick}>Company</Link></li>
            <li><Link to="/pricing" onClick={handleLinkClick}>Pricing</Link></li>
          </ul>
          
          <div className="mobile-auth-buttons">
            {currentUser ? (
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="logout-icon" />
                Logout
              </button>
            ) : (
              <>
                <Link to="/signin" className="mobile-sign-in-btn" onClick={handleLinkClick}>Sign in</Link>
                <Link to="/signup" className="mobile-sign-up-btn" onClick={handleLinkClick}>Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}