// src/pages/Blog/Personal.jsx
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaClock, 
  FaCalendarCheck, 
  FaArrowRight,
  FaHeart,
  FaBuilding,
  FaMoon,
  FaSun,
  FaRocket
} from "react-icons/fa";
import "./blog.css";


export default function Personal() {
  return (
    <>
    
      <div className="blog-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero-content">
            <span className="blog-badge">Personal Blog</span>
            <h1>
              Personal Productivity <br />
              <span className="blog-highlight">& Time Management</span>
            </h1>
            <p>
              Discover practical tips and strategies to maximize your daily productivity,
              achieve work-life balance, and make the most of your time.
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
            <h2>Explore Personal Content</h2>
            <p>Curated resources for personal growth and productivity.</p>
          </div>

          <div className="blog-categories-grid">
            <Link to="/blog/organization" className="blog-category-card">
              <div className="blog-category-icon building">
                <FaBuilding />
              </div>
              <span>Organization</span>
            </Link>
            <Link to="/blog/startup" className="blog-category-card">
              <div className="blog-category-icon startup">
                <FaRocket />
              </div>
              <span>Startup</span>
            </Link>
            <Link to="/blog/personal" className="blog-category-card active">
              <div className="blog-category-icon personal">
                <FaUser />
              </div>
              <span>Personal</span>
            </Link>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="blog-posts">
          <div className="blog-posts-header">
            <h2>Latest Personal Articles</h2>
            <p>Tips and strategies for personal growth and productivity.</p>
          </div>

          <div className="blog-posts-grid">
            <div className="blog-post-card featured">
              <span className="blog-post-featured-badge">Featured</span>
              <div className="blog-post-tag">Personal</div>
              <h3>How to Plan Your Perfect Day</h3>
              <p>A step-by-step guide to maximizing your daily productivity and achieving your goals.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> September 1, 2026
                </span>
                <span className="blog-post-readtime">6 min read</span>
              </div>
              <Link to="/blog/personal/perfect-day" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Personal</div>
              <h3>Balancing Work and Life</h3>
              <p>Strategies for maintaining a healthy work-life balance in a fast-paced world.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 25, 2026
                </span>
                <span className="blog-post-readtime">5 min read</span>
              </div>
              <Link to="/blog/personal/work-life-balance" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Personal</div>
              <h3>Morning Routines for Success</h3>
              <p>How successful professionals start their day and what you can learn from them.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 18, 2026
                </span>
                <span className="blog-post-readtime">4 min read</span>
              </div>
              <Link to="/blog/personal/morning-routines" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Personal</div>
              <h3>Mindfulness and Productivity</h3>
              <p>How mindfulness practices can boost your productivity and reduce stress.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 10, 2026
                </span>
                <span className="blog-post-readtime">7 min read</span>
              </div>
              <Link to="/blog/personal/mindfulness" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-cta">
          <div className="blog-cta-content">
            <h2>Ready to Transform Your Productivity?</h2>
            <p>Join thousands of individuals who use Appointopia to manage their time effectively.</p>
            <div className="blog-cta-actions">
              <Link to="/signup" className="blog-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="blog-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
   
    </>
  );
}