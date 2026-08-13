import {
    FaTwitter,
    FaFacebookF,
    FaLinkedinIn,
    FaYoutube,
    FaChevronDown,
  } from "react-icons/fa";
  
  import logo from "../../assets/images/logo.png";
  
  import "./footer.css";
  
  export default function Footer() {
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
  
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
  
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
  
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
  
              <a href="#" aria-label="YouTube">
                <FaYoutube />
              </a>
  
            </div>
  
          </div>
  
  
          {/* ================= PRODUCT ================= */}
  
          <div className="footer-column">
  
            <h3>Product</h3>
  
            <a href="#">Features</a>
  
            <a href="#">Pricing</a>
  
          </div>
  
  
          {/* ================= RESOURCE ================= */}
  
          <div className="footer-column">
  
            <h3>Resource</h3>
  
            <a href="#">Blog</a>
  
            <a href="#">User guides</a>
  
            <a href="#">Webinars</a>
  
          </div>
  
  
          {/* ================= ABOUT US ================= */}
  
          <div className="footer-column">
  
            <h3>About Us</h3>
  
            <a href="#">About us</a>
  
            <a href="#">Contact us</a>
  
          </div>
  
  
          {/* ================= BLOG ================= */}
  
          <div className="footer-column">
  
            <h3>Blog</h3>
  
            <a href="#">Personal</a>
  
            <a href="#">Start up</a>
  
            <a href="#">Organization</a>
  
          </div>
  
        </div>
  
  
        {/* ================= BOTTOM ================= */}
  
        <div className="footer-bottom">
  
          {/* Language */}
  
          <button className="language-btn">
  
            <span>English</span>
  
            <FaChevronDown />
  
          </button>
  
  
          {/* Copyright */}
  
          <div className="footer-legal">
  
            <span>© 2022 Brand, Inc.</span>
  
            <span>•</span>
  
            <a href="#">Privacy</a>
  
            <span>•</span>
  
            <a href="#">Terms</a>
  
            <span>•</span>
  
            <a href="#">Sitemap</a>
  
          </div>
  
        </div>
  
      </footer>
    );
  }