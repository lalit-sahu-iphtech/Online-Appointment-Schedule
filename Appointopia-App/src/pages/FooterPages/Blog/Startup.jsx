// src/pages/Blog/Startup.jsx
import { Link } from "react-router-dom";
import { 
  FaRocket, 
  FaUser, 
  FaChartLine, 
  FaArrowRight,
  FaBuilding,
  FaLightbulb,
  FaHandshake,
  FaClock,
  FaCog
} from "react-icons/fa";
import "./blog.css";


export default function Startup() {
  return (
    <>
 
      <div className="blog-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-hero-content">
            <span className="blog-badge">Startup Blog</span>
            <h1>
              Scaling Your Startup <br />
              <span className="blog-highlight">Team & Culture</span>
            </h1>
            <p>
              Insights and strategies for founders and startup teams to build effective teams,
              achieve product-market fit, and scale their operations successfully.
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
            <h2>Explore Startup Content</h2>
            <p>Curated resources for founders and startup teams.</p>
          </div>

          <div className="blog-categories-grid">
            <Link to="/blog/organization" className="blog-category-card">
              <div className="blog-category-icon building">
                <FaBuilding />
              </div>
              <span>Organization</span>
            </Link>
            <Link to="/blog/startup" className="blog-category-card active">
              <div className="blog-category-icon startup">
                <FaRocket />
              </div>
              <span>Startup</span>
            </Link>
            <Link to="/blog/personal" className="blog-category-card">
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
            <h2>Latest Startup Articles</h2>
            <p>Insights and strategies for building and scaling your startup.</p>
          </div>

          <div className="blog-posts-grid">
            <div className="blog-post-card featured">
              <span className="blog-post-featured-badge">Featured</span>
              <div className="blog-post-tag">Startup</div>
              <h3>Scaling Your Startup Team</h3>
              <p>Best practices for growing your team effectively while maintaining culture and momentum.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> September 3, 2026
                </span>
                <span className="blog-post-readtime">10 min read</span>
              </div>
              <Link to="/blog/startup/scaling-team" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Startup</div>
              <h3>Product-Market Fit</h3>
              <p>How to know when you've found your perfect market and what to do next.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 29, 2026
                </span>
                <span className="blog-post-readtime">8 min read</span>
              </div>
              <Link to="/blog/startup/product-market-fit" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Startup</div>
              <h3>Building Startup Culture</h3>
              <p>How to build and maintain a strong company culture as your startup grows.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 22, 2026
                </span>
                <span className="blog-post-readtime">6 min read</span>
              </div>
              <Link to="/blog/startup/culture" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>

            <div className="blog-post-card">
              <div className="blog-post-tag">Startup</div>
              <h3>Fundraising Strategies</h3>
              <p>Tips and strategies for successfully raising capital for your startup.</p>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  <FaClock /> August 14, 2026
                </span>
                <span className="blog-post-readtime">9 min read</span>
              </div>
              <Link to="/blog/startup/fundraising" className="blog-post-link">
                Read Article <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-cta">
          <div className="blog-cta-content">
            <h2>Ready to Launch Your Startup?</h2>
            <p>Join thousands of startups that use Appointopia to streamline their scheduling.</p>
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