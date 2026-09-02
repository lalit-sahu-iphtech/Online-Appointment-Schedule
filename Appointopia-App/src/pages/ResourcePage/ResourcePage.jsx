// src/pages/ResourcePage.jsx
import { Link } from "react-router-dom";
import { 
  FaBookOpen, 
  FaVideo, 
  FaNewspaper, 
  FaQuestionCircle,
  FaDownload,
  FaExternalLinkAlt,
  FaArrowRight,
  FaHeadset,
  FaGraduationCap,
  FaFileAlt,
  FaRocket
} from "react-icons/fa";
import "./resourcePage.css";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

export default function ResourcePage() {
  return (
     <>
     <Navbar/>
     <div className="resource-page">
      {/* Hero Section */}
      <section className="resource-hero">
        <div className="resource-hero-content">
          <span className="resource-badge">Learning Center</span>
          <h1>
            Resources to Help You <br />
            <span className="resource-highlight">Succeed with Appointopia</span>
          </h1>
          <p>
            Explore our comprehensive library of guides, tutorials, and articles
            designed to help you make the most of your scheduling experience.
          </p>
          <div className="resource-hero-search">
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="resource-search-input"
            />
            <button className="resource-search-btn">Search</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="resource-categories">
        <div className="resource-categories-grid">
          <div className="resource-category-card">
            <div className="resource-category-icon purple">
              <FaBookOpen />
            </div>
            <h3>Documentation</h3>
            <p>Complete guides and API references to integrate and use Appointopia.</p>
            <Link to="/docs" className="resource-category-link">
              Explore Docs <FaArrowRight />
            </Link>
          </div>

          <div className="resource-category-card">
            <div className="resource-category-icon blue">
              <FaVideo />
            </div>
            <h3>Video Tutorials</h3>
            <p>Step-by-step video guides covering all features and workflows.</p>
            <Link to="/videos" className="resource-category-link">
              Watch Videos <FaArrowRight />
            </Link>
          </div>

          <div className="resource-category-card">
            <div className="resource-category-icon orange">
              <FaNewspaper />
            </div>
            <h3>Blog & Articles</h3>
            <p>Insights, tips, and best practices from scheduling experts.</p>
            <Link to="/blog" className="resource-category-link">
              Read Articles <FaArrowRight />
            </Link>
          </div>

          <div className="resource-category-card">
            <div className="resource-category-icon green">
              <FaQuestionCircle />
            </div>
            <h3>FAQ</h3>
            <p>Quick answers to the most frequently asked questions.</p>
            <Link to="/faq" className="resource-category-link">
              View FAQ <FaArrowRight />
            </Link>
          </div>

          <div className="resource-category-card">
            <div className="resource-category-icon teal">
              <FaDownload />
            </div>
            <h3>Downloads</h3>
            <p>Whitepapers, case studies, and free downloadable resources.</p>
            <Link to="/downloads" className="resource-category-link">
              Download Now <FaArrowRight />
            </Link>
          </div>

          <div className="resource-category-card">
            <div className="resource-category-icon red">
              <FaHeadset />
            </div>
            <h3>Support</h3>
            <p>Get help from our dedicated support team available 24/7.</p>
            <Link to="/contact" className="resource-category-link">
              Contact Support <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="resource-featured">
        <div className="resource-featured-header">
          <span className="resource-featured-badge">Featured</span>
          <h2>Most Popular Resources</h2>
          <p>Hand-picked resources to help you get started quickly.</p>
        </div>

        <div className="resource-featured-grid">
          <div className="resource-featured-card">
            <div className="resource-featured-card-header">
              <FaGraduationCap className="resource-featured-icon" />
              <span className="resource-featured-type">Guide</span>
            </div>
            <h3>Getting Started with Appointopia</h3>
            <p>Learn the basics of scheduling, managing meetings, and automating workflows.</p>
            <Link to="/resources/getting-started" className="resource-featured-link">
              Read Guide <FaExternalLinkAlt />
            </Link>
          </div>

          <div className="resource-featured-card">
            <div className="resource-featured-card-header">
              <FaFileAlt className="resource-featured-icon" />
              <span className="resource-featured-type">Whitepaper</span>
            </div>
            <h3>The Future of Appointment Scheduling</h3>
            <p>Discover emerging trends and how AI is transforming the scheduling landscape.</p>
            <Link to="/resources/future-scheduling" className="resource-featured-link">
              Download Whitepaper <FaExternalLinkAlt />
            </Link>
          </div>

          <div className="resource-featured-card">
            <div className="resource-featured-card-header">
              <FaRocket className="resource-featured-icon" />
              <span className="resource-featured-type">Tutorial</span>
            </div>
            <h3>Mastering Workflow Automations</h3>
            <p>Step-by-step guide to creating powerful workflows that save you time.</p>
            <Link to="/resources/workflow-automation" className="resource-featured-link">
              Start Tutorial <FaExternalLinkAlt />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="resource-cta">
        <div className="resource-cta-content">
          <h2>Can't Find What You're Looking For?</h2>
          <p>Our support team is here to help you with any questions or issues.</p>
          <div className="resource-cta-actions">
            <Link to="/contact" className="resource-btn-primary">
              Contact Support <FaArrowRight />
            </Link>
            <Link to="/community" className="resource-btn-outline">
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
     </>
     
  );
}