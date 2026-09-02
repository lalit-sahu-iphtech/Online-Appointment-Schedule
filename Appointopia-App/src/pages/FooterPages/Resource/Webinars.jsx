// src/pages/Resource/Webinars.jsx
import { Link } from "react-router-dom";
import { 
  FaVideo, 
  FaUser,
  FaClock, 
  FaArrowRight, 
  FaCalendarAlt,
  FaUsers,
  FaPlayCircle,
  FaStar
} from "react-icons/fa";
import "./resources.css";


export default function Webinars() {
  const webinars = [
    {
      title: "Mastering Appointopia: Complete Overview",
      date: "Feb 10, 2026",
      time: "10:00 AM EST",
      speaker: "Sarah Johnson",
      description: "A comprehensive walkthrough of all Appointopia features and how to use them effectively.",
      category: "Beginner",
      registered: 124
    },
    {
      title: "Team Collaboration 101",
      date: "Feb 15, 2026",
      time: "2:00 PM EST",
      speaker: "Michael Chen",
      description: "Learn how to leverage Appointopia for seamless team collaboration and coordination.",
      category: "Intermediate",
      registered: 89
    },
    {
      title: "Advanced Automation Workflows",
      date: "Feb 20, 2026",
      time: "11:00 AM EST",
      speaker: "Emily Rodriguez",
      description: "Discover powerful automation strategies to streamline your scheduling processes.",
      category: "Advanced",
      registered: 67
    },
    {
      title: "Enterprise Security & Compliance",
      date: "Feb 25, 2026",
      time: "1:00 PM EST",
      speaker: "David Kim",
      description: "Understanding security features and compliance standards for enterprise users.",
      category: "Advanced",
      registered: 45
    }
  ];

  return (
    <>

      <div className="resources-page">
        {/* Hero Section */}
        <section className="resources-hero webinar-hero">
          <div className="resources-hero-content">
            <span className="resources-badge">Webinars</span>
            <h1>
              Live and Recorded <br />
              <span className="resources-highlight">Learning Sessions</span>
            </h1>
            <p>
              Join our expert-led webinars to learn best practices, discover new features,
              and get your questions answered live.
            </p>
            <div className="resources-hero-actions">
              <Link to="/signup" className="resources-btn-primary">
                Get Started <FaArrowRight />
              </Link>
              <Link to="/resources/guides" className="resources-btn-secondary">
                View Guides
              </Link>
            </div>
          </div>
        </section>

        {/* Webinars Grid */}
        <section className="resources-webinars">
          <div className="resources-webinars-header">
            <h2>Upcoming Webinars</h2>
            <p>Join live sessions or watch recordings.</p>
          </div>

          <div className="resources-webinars-grid">
            {webinars.map((webinar, index) => (
              <div key={index} className="resources-webinar-card">
                <div className="resources-webinar-card-header">
                  <div className="resources-webinar-icon">
                    <FaVideo />
                  </div>
                  <span className={`resources-webinar-category ${webinar.category.toLowerCase()}`}>
                    {webinar.category}
                  </span>
                </div>
                <h3>{webinar.title}</h3>
                <p>{webinar.description}</p>
                <div className="resources-webinar-meta">
                  <span className="resources-webinar-date">
                    <FaCalendarAlt /> {webinar.date}
                  </span>
                  <span className="resources-webinar-time">
                    <FaClock /> {webinar.time}
                  </span>
                </div>
                <div className="resources-webinar-speaker">
                  <FaUser /> {webinar.speaker}
                </div>
                <div className="resources-webinar-registered">
                  <FaUsers /> {webinar.registered} registered
                </div>
                <button className="resources-webinar-register-btn">
                  <FaPlayCircle /> Register Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Recorded Webinars */}
        <section className="resources-recorded">
          <div className="resources-recorded-header">
            <h2>Recorded Webinars</h2>
            <p>Watch previous sessions at your convenience.</p>
          </div>

          <div className="resources-recorded-grid">
            <div className="resources-recorded-card">
              <div className="resources-recorded-thumbnail">
                <div className="resources-recorded-play">
                  <FaPlayCircle />
                </div>
              </div>
              <div className="resources-recorded-info">
                <h3>Getting Started with Appointopia</h3>
                <p>Learn the basics and get up and running quickly.</p>
                <div className="resources-recorded-meta">
                  <span><FaCalendarAlt /> Jan 20, 2026</span>
                  <span><FaClock /> 45 min</span>
                </div>
                <button className="resources-recorded-watch-btn">
                  Watch Recording <FaArrowRight />
                </button>
              </div>
            </div>

            <div className="resources-recorded-card">
              <div className="resources-recorded-thumbnail">
                <div className="resources-recorded-play">
                  <FaPlayCircle />
                </div>
              </div>
              <div className="resources-recorded-info">
                <h3>Advanced Scheduling Techniques</h3>
                <p>Master advanced features and optimize your workflow.</p>
                <div className="resources-recorded-meta">
                  <span><FaCalendarAlt /> Jan 10, 2026</span>
                  <span><FaClock /> 50 min</span>
                </div>
                <button className="resources-recorded-watch-btn">
                  Watch Recording <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="resources-cta">
          <div className="resources-cta-content">
            <h2>Ready to Transform Your Scheduling?</h2>
            <p>Join thousands of professionals who trust Appointopia.</p>
            <div className="resources-cta-actions">
              <Link to="/signup" className="resources-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/contact" className="resources-btn-outline">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </div>
     
    </>
  );
}