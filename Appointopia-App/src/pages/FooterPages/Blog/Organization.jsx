// src/pages/Blog/Organization.jsx
import { Link } from "react-router-dom";
import { 
  FaBuilding, 
  FaUsers, 
  FaChartLine, 
  FaArrowRight,
  FaCalendarCheck,
  FaShieldAlt,
  FaClock,
  FaCog
} from "react-icons/fa";
import "./blog.css";


export default function Organization() {
  return (
    <>
     
      <div className="blog-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero-content">
            <span className="blog-badge">Enterprise Blog</span>
            <h1>
              Enterprise Scheduling <br />
              <span className="blog-highlight">Solutions & Best Practices</span>
            </h1>
            <p>
              Discover how large organizations manage complex scheduling, scale their teams,
              and optimize productivity with enterprise-level strategies.
            </p>
            <div className="blog-hero-actions">
              <Link to="/blog" className="blog-btn-primary">
                View All Posts <FaArrowRight />
              </Link>
              <Link to="/signup" className="blog-btn-secondary">
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Categories */}
        <section className="blog-categories">
          <div className="blog-categories-header">
            <span className="blog-categories-badge">Categories</span>
            <h2>Explore Enterprise Content</h2>
            <p>Curated resources for organizational success.</p>
          </div>

          <div className="blog-categories-grid">
            <Link to="/blog/organization" className="blog-category-card active">
              <div className="blog-category-icon building">
                <FaBuilding />
              </div>
              <span>Organization</span>
            </Link>
            <Link to="/blog/startup" className="blog-category-card">
              <div className="blog-category-icon startup">
                <FaCog />
              </div>
              <span>Startup</span>
            </Link>
            <Link to="/blog/personal" className="blog-category-card">
              <div className="blog-category-icon personal">
                <FaUsers />
              </div>
              <span>Personal</span>
            </Link>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="blog-posts">
          <div className="blog-posts-header">
            <h2>Latest Enterprise Articles</h2>
            <p>Insights and best practices for organizational success.</p>
          </div>

          <div className="blog-posts-grid">
            <div className="blog-post-card featured">
              <span className="blog-post-featured-badge">Featured</span>
              <div className="blog-post-tag">Organization</div>
              <h3>Enterprise Scheduling Solutions</h3>
              <p>How large organizations manage complex scheduling across departments and time zones.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> September 2, 2026
                </span>
                <span className="blog-post-readtime">8 min read</span>
              </div>
              <Link to="/blog/organization/enterprise-scheduling" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Organization</div>
              <h3>Team Productivity at Scale</h3>
              <p>Strategies for maintaining productivity and alignment across large, distributed teams.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 28, 2026
                </span>
                <span className="blog-post-readtime">6 min read</span>
              </div>
              <Link to="/blog/organization/team-productivity" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Organization</div>
              <h3>Enterprise Calendar Integration</h3>
              <p>Best practices for integrating calendars across enterprise tools and platforms.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 20, 2026
                </span>
                <span className="blog-post-readtime">5 min read</span>
              </div>
              <Link to="/blog/organization/calendar-integration" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Organization</div>
              <h3>Security and Compliance in Scheduling</h3>
              <p>How enterprise scheduling solutions maintain security standards and regulatory compliance.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 15, 2026
                </span>
                <span className="blog-post-readtime">7 min read</span>
              </div>
              <Link to="/blog/organization/security-compliance" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-cta">
          <div className="blog-cta-content">
            <h2>Ready to Transform Your Organization?</h2>
            <p>Join thousands of enterprises that trust Appointopia for their scheduling needs.</p>
            <div className="blog-cta-actions">
              <Link to="/signup" className="blog-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/contact" className="blog-btn-outline">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </div>
  
    </>
  );
}