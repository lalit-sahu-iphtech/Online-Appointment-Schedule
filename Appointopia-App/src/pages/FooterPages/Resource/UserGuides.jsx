// src/pages/Resource/UserGuides.jsx
import { Link } from "react-router-dom";
import { 
  FaBookOpen, 
  FaArrowRight, 
  FaStar, 
  FaClock,
  FaUser,
  FaPlayCircle,
  FaDownload
} from "react-icons/fa";
import "./resources.css";


export default function UserGuides() {
  const guides = [
    {
      title: "Getting Started with Appointopia",
      description: "Learn the basics of Appointopia in 5 minutes and start scheduling like a pro.",
      level: "Beginner",
      time: "5 min read",
      category: "Basics",
      popular: true
    },
    {
      title: "Advanced Scheduling Techniques",
      description: "Master advanced scheduling tools and features to maximize your productivity.",
      level: "Advanced",
      time: "10 min read",
      category: "Advanced",
      popular: false
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Quick solutions to the most common issues users face.",
      level: "Intermediate",
      time: "7 min read",
      category: "Support",
      popular: false
    },
    {
      title: "Team Collaboration Best Practices",
      description: "Learn how to effectively collaborate with your team using Appointopia.",
      level: "Intermediate",
      time: "8 min read",
      category: "Collaboration",
      popular: false
    },
    {
      title: "Integrating with Calendar Apps",
      description: "Connect Appointopia with Google Calendar, Outlook, and more.",
      level: "Beginner",
      time: "6 min read",
      category: "Integration",
      popular: true
    },
    {
      title: "API Documentation & Guide",
      description: "Comprehensive API guide for developers building custom integrations.",
      level: "Advanced",
      time: "15 min read",
      category: "Developer",
      popular: false
    }
  ];

  return (
    <>
    
      <div className="resources-page">
        {/* Hero Section */}
        <section className="resources-hero">
          <div className="resources-hero-content">
            <span className="resources-badge">User Guides</span>
            <h1>
              Comprehensive Guides to <br />
              <span className="resources-highlight">Help You Succeed</span>
            </h1>
            <p>
              Explore our library of detailed guides designed to help you get the most 
              out of Appointopia.
            </p>
            <div className="resources-hero-actions">
              <Link to="/signup" className="resources-btn-primary">
                Get Started <FaArrowRight />
              </Link>
              <Link to="/resources/webinars" className="resources-btn-secondary">
                View Webinars
              </Link>
            </div>
          </div>
        </section>

        {/* Guides Grid */}
        <section className="resources-guides">
          <div className="resources-guides-header">
            <h2>All User Guides</h2>
            <p>Step-by-step guides for every feature.</p>
          </div>

          <div className="resources-guides-grid">
            {guides.map((guide, index) => (
              <div key={index} className={`resources-guide-card ${guide.popular ? 'popular' : ''}`}>
                {guide.popular && (
                  <span className="resources-guide-popular-badge">
                    <FaStar /> Popular
                  </span>
                )}
                <div className="resources-guide-icon">
                  <FaBookOpen />
                </div>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                <div className="resources-guide-meta">
                  <span className="resources-guide-level">{guide.level}</span>
                  <span className="resources-guide-time">
                    <FaClock /> {guide.time}
                  </span>
                </div>
                <div className="resources-guide-category">{guide.category}</div>
                <Link to={`/guides/${guide.title.toLowerCase().replace(/\s+/g, '-')}`} className="resources-guide-link">
                  Read Guide <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="resources-quick-links">
          <div className="resources-quick-links-content">
            <h2>Quick Resources</h2>
            <div className="resources-quick-links-grid">
              <Link to="/resources/videos" className="resources-quick-link">
                <div className="resources-quick-icon">
                  <FaPlayCircle />
                </div>
                <span>Video Tutorials</span>
              </Link>
              <Link to="/resources/downloads" className="resources-quick-link">
                <div className="resources-quick-icon">
                  <FaDownload />
                </div>
                <span>Downloads</span>
              </Link>
              <Link to="/resources/faq" className="resources-quick-link">
                <div className="resources-quick-icon">
                  <FaUser />
                </div>
                <span>FAQ</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="resources-cta">
          <div className="resources-cta-content">
            <h2>Ready to Learn More?</h2>
            <p>Start your journey with Appointopia today.</p>
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