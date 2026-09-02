// src/pages/ProductPage.jsx
import { Link } from "react-router-dom";
import { 
  FaCalendarCheck, 
  FaBell, 
  FaChartLine, 
  FaUsers, 
  FaMobileAlt, 
  FaShieldAlt,
  FaArrowRight,
  FaPlayCircle,
  FaCheckCircle
} from "react-icons/fa";
import "./productPage.css";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

export default function ProductPage() {
  return (
     <>
     <Navbar/>
     <div className="product-page">
      {/* Hero Section */}
      <section className="product-hero">
        <div className="product-hero-content">
          <span className="product-badge">Smart Scheduling Platform</span>
          <h1>
            Streamline Your <br />
            <span className="product-highlight">Appointment Management</span>
          </h1>
          <p>
            Automate your scheduling workflow with intelligent time slot recommendations,
            real-time notifications, and powerful analytics — all in one place.
          </p>
          <div className="product-hero-actions">
            <Link to="/signup" className="product-btn-primary">
              Get Started Free <FaArrowRight />
            </Link>
            <button className="product-btn-secondary">
              <FaPlayCircle /> Watch Demo
            </button>
          </div>
          <div className="product-hero-stats">
            <div className="product-stat">
              <span className="product-stat-number">10K+</span>
              <span className="product-stat-label">Meetings Scheduled</span>
            </div>
            <div className="product-stat-divider"></div>
            <div className="product-stat">
              <span className="product-stat-number">98%</span>
              <span className="product-stat-label">Satisfaction Rate</span>
            </div>
            <div className="product-stat-divider"></div>
            <div className="product-stat">
              <span className="product-stat-number">4.9</span>
              <span className="product-stat-label">User Rating</span>
            </div>
          </div>
        </div>
        <div className="product-hero-visual">
          <div className="product-hero-card">
            <div className="product-hero-card-header">
              <div className="product-hero-card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>Meeting Schedule</span>
            </div>
            <div className="product-hero-card-body">
              <div className="product-hero-event">
                <div className="product-hero-event-color purple"></div>
                <div>
                  <h4>Team Sync</h4>
                  <p>10:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="product-hero-event">
                <div className="product-hero-event-color teal"></div>
                <div>
                  <h4>Client Call</h4>
                  <p>2:30 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="product-hero-event">
                <div className="product-hero-event-color orange"></div>
                <div>
                  <h4>Project Review</h4>
                  <p>4:00 PM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="product-features-section">
        <div className="product-features-header">
          <span className="product-features-badge">Features</span>
          <h2>Everything You Need to <span className="product-highlight">Stay Organized</span></h2>
          <p>Powerful tools designed to simplify your scheduling workflow and boost productivity.</p>
        </div>

        <div className="product-features-grid">
          <div className="product-feature-card">
            <div className="product-feature-icon purple">
              <FaCalendarCheck />
            </div>
            <h3>Smart Scheduling</h3>
            <p>AI-powered time slot recommendations that adapt to your availability and preferences.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> Intelligent time slot detection</li>
              <li><FaCheckCircle /> One-click meeting creation</li>
              <li><FaCheckCircle /> Calendar integration</li>
            </ul>
          </div>

          <div className="product-feature-card">
            <div className="product-feature-icon blue">
              <FaBell />
            </div>
            <h3>Real-time Notifications</h3>
            <p>Stay informed with instant alerts and smart reminders for all your appointments.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> Push notifications</li>
              <li><FaCheckCircle /> Email reminders</li>
              <li><FaCheckCircle /> Smart follow-ups</li>
            </ul>
          </div>

          <div className="product-feature-card">
            <div className="product-feature-icon green">
              <FaChartLine />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Gain valuable insights into your scheduling patterns and meeting performance.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> Meeting analytics</li>
              <li><FaCheckCircle /> Booking trends</li>
              <li><FaCheckCircle /> Performance metrics</li>
            </ul>
          </div>

          <div className="product-feature-card">
            <div className="product-feature-icon orange">
              <FaUsers />
            </div>
            <h3>Team Collaboration</h3>
            <p>Seamlessly coordinate schedules and share calendars with your entire team.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> Team calendar sharing</li>
              <li><FaCheckCircle /> Meeting invitations</li>
              <li><FaCheckCircle /> Shared availability</li>
            </ul>
          </div>

          <div className="product-feature-card">
            <div className="product-feature-icon teal">
              <FaMobileAlt />
            </div>
            <h3>Mobile Friendly</h3>
            <p>Access and manage your appointments from anywhere, on any device.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> Responsive design</li>
              <li><FaCheckCircle /> Mobile-optimized views</li>
              <li><FaCheckCircle /> Cross-platform sync</li>
            </ul>
          </div>

          <div className="product-feature-card">
            <div className="product-feature-icon red">
              <FaShieldAlt />
            </div>
            <h3>Enterprise Security</h3>
            <p>Your data is protected with industry-leading security and privacy standards.</p>
            <ul className="product-feature-list">
              <li><FaCheckCircle /> End-to-end encryption</li>
              <li><FaCheckCircle /> Secure data storage</li>
              <li><FaCheckCircle /> Access control</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="product-cta">
        <div className="product-cta-content">
          <h2>Ready to Transform Your Scheduling?</h2>
          <p>Join thousands of professionals who trust Appointopia to manage their appointments efficiently.</p>
          <div className="product-cta-actions">
            <Link to="/signup" className="product-btn-primary">
              Start Free Trial <FaArrowRight />
            </Link>
            <Link to="/pricing" className="product-btn-outline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
     </>
  );
}