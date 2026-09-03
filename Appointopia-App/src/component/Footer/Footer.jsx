// src/component/Footer/Footer.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaChevronDown,
  FaGlobe,
  FaCheck,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";

import "./footer.css";

export default function Footer() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const dropdownRef = useRef(null);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇦🇪" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle language selection
  const handleLanguageSelect = (language) => {
    console.log(` Language changed to: ${language.name} (${language.code})`);
    setSelectedLanguage(language.name);
    setIsLanguageOpen(false);

    // Save to localStorage
    localStorage.setItem("preferredLanguage", language.code);
  };

  // Toggle dropdown
  const toggleLanguageDropdown = (e) => {
    e.stopPropagation();
    setIsLanguageOpen(!isLanguageOpen);
    console.log(`Language dropdown ${!isLanguageOpen ? 'opened' : 'closed'}`);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* ================= LEFT SECTION ================= */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src={logo} alt="Appointopia" />
            <h2>Appointopia</h2>
          </div>

          <p>
            Say hello to Appointopia, the innovative
            <br />
            schedule app designed to simplify your life and
            <br />
            make scheduling a breeze!
          </p>

          {/* Social Icons */}
          <div className="footer-social">
            <a 
              href="#" 
              aria-label="Twitter"
              onClick={(e) => {
                e.preventDefault();
                console.log('Twitter icon clicked');
                window.open('https://twitter.com/appointopia', '_blank');
              }}
            >
              <FaTwitter />
            </a>
            <a 
              href="#" 
              aria-label="Facebook"
              onClick={(e) => {
                e.preventDefault();
                console.log(' Facebook icon clicked');
                window.open('https://facebook.com/appointopia', '_blank');
              }}
            >
              <FaFacebookF />
            </a>
            <a 
              href="#" 
              aria-label="LinkedIn"
              onClick={(e) => {
                e.preventDefault();
                console.log(' LinkedIn icon clicked');
                window.open('https://linkedin.com/company/appointopia', '_blank');
              }}
            >
              <FaLinkedinIn />
            </a>
            <a 
              href="#" 
              aria-label="YouTube"
              onClick={(e) => {
                e.preventDefault();
                console.log(' YouTube icon clicked');
                window.open('https://youtube.com/appointopia', '_blank');
              }}
            >
              <FaYoutube />
            </a>
          </div>
        </div>

      <div className="footer-grid">

        {/* ================= PRODUCT ================= */}
        <div className="footer-column">
          <h3>Product</h3>
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        {/* ================= RESOURCE ================= */}
        <div className="footer-column">
          <h3>Resource</h3>
          <Link to="/blog">Blog</Link>
          <Link to="/user-guides">User guides</Link>
          <Link to="/webinars">Webinars</Link>
        </div>

        {/* ================= ABOUT US ================= */}
        <div className="footer-column">
          <h3>About Us</h3>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact us</Link>
        </div>

        {/* ================= BLOG ================= */}
        <div className="footer-column">
          <h3>Blog</h3>
          <Link to="/blog/personal">Personal</Link>
          <Link to="/blog/startup">Start up</Link>
          <Link to="/blog/organization">Organization</Link>
        </div>
      </div>
    </div>
      {/* ================= BOTTOM ================= */}
      <div className="footer-bottom">
        {/* Language Dropdown - Opens Upward */}
        <div className="language-dropdown-wrapper" ref={dropdownRef}>
          <button
            className="language-btn"
            onClick={toggleLanguageDropdown}
            aria-expanded={isLanguageOpen}
            aria-haspopup="true"
          >
            <span className="language-btn-content">
              <FaGlobe className="globe-icon" />
              <span>{selectedLanguage}</span>
            </span>
            <FaChevronDown className={`chevron-icon ${isLanguageOpen ? 'rotated' : ''}`} />
          </button>

          {/* Dropdown Menu - Opens Upward */}
          {isLanguageOpen && (
            <div className="language-dropdown dropdown-up">
              <ul className="language-list">
                {languages.map((language) => (
                  <li key={language.code}>
                    <button
                      className={`language-option ${
                        selectedLanguage === language.name ? 'active' : ''
                      }`}
                      onClick={() => handleLanguageSelect(language)}
                    >
                      <span className="language-flag">{language.flag}</span>
                      <span className="language-name">{language.name}</span>
                      {selectedLanguage === language.name && (
                        <FaCheck className="language-check" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="footer-legal">
          <span>© 2026 Brand, Inc.</span>
          <span>•</span>
          <Link to="/privacy">Privacy</Link>
          <span>•</span>
          <Link to="/terms">Terms</Link>
          <span>•</span>
          <Link to="/sitemap">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}