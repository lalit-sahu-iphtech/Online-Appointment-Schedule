// src/pages/Legal/Sitemap.jsx
import { Link } from "react-router-dom";
import { 
  FaSitemap, 
  FaArrowRight, 
  FaHome,
  FaCalendarCheck,
  FaUsers,
  FaBookOpen,
  FaShieldAlt
} from "react-icons/fa";
import "./legal.css";


export default function Sitemap() {
  const sections = [
    {
      title: "Product",
      icon: <FaCalendarCheck />,
      links: [
        { label: "Features", path: "/features" },
        { label: "Pricing", path: "/pricing" },
        { label: "Integrations", path: "/integrations" }
      ]
    },
    {
      title: "Resources",
      icon: <FaBookOpen />,
      links: [
        { label: "Blog", path: "/blog" },
        { label: "User Guides", path: "/user-guides" },
        { label: "Webinars", path: "/webinars" },
        { label: "FAQ", path: "/faq" }
      ]
    },
    {
      title: "About",
      icon: <FaUsers />,
      links: [
        { label: "About Us", path: "/about" },
        { label: "Contact Us", path: "/contact" },
        { label: "Careers", path: "/careers" }
      ]
    },
    {
      title: "Blog Categories",
      icon: <FaBookOpen />,
      links: [
        { label: "Personal Blog", path: "/blog/personal" },
        { label: "Startup Blog", path: "/blog/startup" },
        { label: "Organization Blog", path: "/blog/organization" }
      ]
    },
    {
      title: "Legal",
      icon: <FaShieldAlt />,
      links: [
        { label: "Privacy Policy", path: "/privacy" },
        { label: "Terms of Service", path: "/terms" },
        { label: "Cookie Policy", path: "/cookies" }
      ]
    }
  ];

  return (
    <>
      <div className="legal-page sitemap-page">
        {/* Hero Section */}
        <section className="legal-hero sitemap-hero">
          <div className="legal-hero-content">
            <span className="legal-badge">Sitemap</span>
            <h1>
              Navigate <br />
              <span className="legal-highlight">Appointopia</span>
            </h1>
            <p>
              Explore all the pages and resources available on our platform. Find what you're
              looking for quickly and easily.
            </p>
          </div>
        </section>

        {/* Sitemap Grid */}
        <section className="sitemap-content">
          <div className="sitemap-grid">
            {sections.map((section, index) => (
              <div key={index} className="sitemap-column">
                <div className="sitemap-column-header">
                  <span className="sitemap-column-icon">{section.icon}</span>
                  <h3>{section.title}</h3>
                </div>
                <ul className="sitemap-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.path} className="sitemap-link">
                        {link.label} <FaArrowRight />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Additional Pages */}
          <div className="sitemap-additional">
            <div className="sitemap-additional-header">
              <span className="sitemap-additional-icon"><FaHome /></span>
              <h3>Quick Access</h3>
            </div>
            <div className="sitemap-additional-grid">
              <Link to="/" className="sitemap-quick-link">
                <span>Home</span>
                <FaArrowRight />
              </Link>
              <Link to="/calendar" className="sitemap-quick-link">
                <span>Calendar</span>
                <FaArrowRight />
              </Link>
              <Link to="/appointment-schedule" className="sitemap-quick-link">
                <span>Appointments</span>
                <FaArrowRight />
              </Link>
              <Link to="/workflows" className="sitemap-quick-link">
                <span>Workflows</span>
                <FaArrowRight />
              </Link>
              <Link to="/profile" className="sitemap-quick-link">
                <span>Profile</span>
                <FaArrowRight />
              </Link>
              <Link to="/settings" className="sitemap-quick-link">
                <span>Settings</span>
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="legal-cta">
          <div className="legal-cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users today.</p>
            <div className="legal-cta-actions">
              <Link to="/signup" className="legal-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="legal-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}