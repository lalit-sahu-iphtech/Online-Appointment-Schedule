// src/pages/Features/Features.jsx
import { Link } from "react-router-dom";
import { 
  FaCalendarCheck, 
  FaUsers, 
  FaChartLine, 
  FaBell, 
  FaShieldAlt, 
  FaSync,
  FaRocket,
  FaArrowRight,
  FaMobileAlt,
  FaHeadset,
  FaCog
} from "react-icons/fa";
import "./features.css";


export default function Features() {
  return (
    
    
      <div className="features-page">
        {/* Hero Section */}
        <section className="features-hero">
          <div className="features-hero-content">
            <span className="features-badge">Powerful Features</span>
            <h1>
              Everything You Need to <br />
              <span className="features-highlight">Master Your Schedule</span>
            </h1>
            <p>
              Discover the complete suite of tools designed to simplify scheduling,
              boost productivity, and help you focus on what truly matters.
            </p>
            <div className="features-hero-actions">
              <Link to="/signup" className="features-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="features-btn-secondary">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="features-grid-section">
          <div className="features-grid-header">
            <span className="features-grid-badge">All Features</span>
            <h2>Built for Modern Scheduling</h2>
            <p>From smart automation to real-time insights — everything you need to stay organized.</p>
          </div>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-card-icon purple">
                <FaCalendarCheck />
              </div>
              <h3>Smart Scheduling</h3>
              <p>AI-powered scheduling that adapts to your preferences and automatically finds the best times.</p>
              <ul className="feature-card-list">
                <li>Intelligent time slot detection</li>
                <li>One-click meeting creation</li>
                <li>Calendar conflict prevention</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-card-icon blue">
                <FaUsers />
              </div>
              <h3>Team Collaboration</h3>
              <p>Seamlessly coordinate schedules and share calendars with your entire team.</p>
              <ul className="feature-card-list">
                <li>Team calendar sharing</li>
                <li>Meeting invitations</li>
                <li>Shared availability views</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-card-icon green">
                <FaChartLine />
              </div>
              <h3>Analytics Dashboard</h3>
              <p>Track your productivity with real-time insights and detailed meeting analytics.</p>
              <ul className="feature-card-list">
                <li>Meeting performance metrics</li>
                <li>Booking trends analysis</li>
                <li>Team productivity reports</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-card-icon orange">
                <FaBell />
              </div>
              <h3>Smart Notifications</h3>
              <p>Stay informed with instant alerts and intelligent reminders across all devices.</p>
              <ul className="feature-card-list">
                <li>Push notifications</li>
                <li>Email reminders</li>
                <li>Smart follow-ups</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="feature-card">
              <div className="feature-card-icon teal">
                <FaSync />
              </div>
              <h3>Calendar Sync</h3>
              <p>Seamless integration with Google Calendar, Outlook, and other popular platforms.</p>
              <ul className="feature-card-list">
                <li>Two-way sync</li>
                <li>Real-time updates</li>
                <li>Multiple calendar support</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-card-icon red">
                <FaShieldAlt />
              </div>
              <h3>Enterprise Security</h3>
              <p>Your data is protected with industry-leading security and privacy standards.</p>
              <ul className="feature-card-list">
                <li>End-to-end encryption</li>
                <li>Secure data storage</li>
                <li>Access control & SSO</li>
              </ul>
            </div>

            {/* Feature 7 */}
            <div className="feature-card">
              <div className="feature-card-icon pink">
                <FaMobileAlt />
              </div>
              <h3>Mobile Friendly</h3>
              <p>Access and manage your appointments from anywhere, on any device.</p>
              <ul className="feature-card-list">
                <li>Fully responsive design</li>
                <li>Mobile-optimized interface</li>
                <li>Cross-platform sync</li>
              </ul>
            </div>

            {/* Feature 8 */}
            <div className="feature-card">
              <div className="feature-card-icon indigo">
                <FaCog />
              </div>
              <h3>Custom Workflows</h3>
              <p>Create powerful automation workflows that save time and reduce manual effort.</p>
              <ul className="feature-card-list">
                <li>Automated email sequences</li>
                <li>Webhook integrations</li>
                <li>Custom action triggers</li>
              </ul>
            </div>

            {/* Feature 9 */}
            <div className="feature-card">
              <div className="feature-card-icon cyan">
                <FaHeadset />
              </div>
              <h3>Dedicated Support</h3>
              <p>Get help whenever you need it with our responsive support team.</p>
              <ul className="feature-card-list">
                <li>24/7 email support</li>
                <li>Live chat assistance</li>
                <li>Comprehensive help center</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section className="features-highlights">
          <div className="features-highlights-header">
            <span className="features-highlights-badge">Why Choose Us</span>
            <h2>Built for Teams, Loved by Individuals</h2>
            <p>Thousands of users trust Appointopia to manage their schedules efficiently.</p>
          </div>

          <div className="features-highlights-grid">
            <div className="highlights-card">
              <div className="highlights-number">01</div>
              <h3>Intelligent Automation</h3>
              <p>Reduce manual scheduling time by up to 80% with smart automation features.</p>
            </div>
            <div className="highlights-card">
              <div className="highlights-number">02</div>
              <h3>Real-time Collaboration</h3>
              <p>Work seamlessly with your team through shared calendars and instant updates.</p>
            </div>
            <div className="highlights-card">
              <div className="highlights-number">03</div>
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive analytics and performance tracking.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="features-cta">
          <div className="features-cta-content">
            <h2>Ready to Transform Your Scheduling?</h2>
            <p>Join thousands of professionals who trust Appointopia to manage their appointments.</p>
            <div className="features-cta-actions">
              <Link to="/signup" className="features-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="features-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    
    
  );
}