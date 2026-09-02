// src/pages/Blog/Blog.jsx
import { Link } from "react-router-dom";
import { 
  FaArrowRight, 
  FaCalendarAlt, 
  FaUser, 
  FaClock,
  FaTag,
  FaSearch
} from "react-icons/fa";
import "./blogMain.css";


export default function Blog() {
  const posts = [
    { 
      title: '10 Tips for Better Time Management', 
      date: 'Jan 15, 2026',
      author: 'Sarah Johnson',
      category: 'Productivity',
      readTime: '5 min read',
      excerpt: 'Discover proven strategies to take control of your schedule and boost your daily productivity.',
      featured: true
    },
    { 
      title: 'How AI is Changing Scheduling', 
      date: 'Jan 10, 2026',
      author: 'Michael Chen',
      category: 'Technology',
      readTime: '4 min read',
      excerpt: 'Explore the transformative impact of artificial intelligence on modern scheduling systems.',
      featured: false
    },
    { 
      title: 'Remote Work Best Practices', 
      date: 'Jan 5, 2026',
      author: 'Emily Rodriguez',
      category: 'Remote Work',
      readTime: '6 min read',
      excerpt: 'Essential strategies and tools for building a successful remote work culture.',
      featured: false
    },
    { 
      title: 'Mastering Team Collaboration', 
      date: 'Dec 28, 2025',
      author: 'David Kim',
      category: 'Collaboration',
      readTime: '7 min read',
      excerpt: 'Learn how to foster effective collaboration and communication within your team.',
      featured: false
    },
    { 
      title: 'The Future of Work', 
      date: 'Dec 20, 2025',
      author: 'Lisa Thompson',
      category: 'Future Trends',
      readTime: '8 min read',
      excerpt: 'Insights into how work is evolving and what it means for professionals everywhere.',
      featured: false
    }
  ];

  const featuredPost = posts.find(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <>
   
      <div className="blog-main-page">
        {/* Hero Section */}
        <section className="blog-main-hero">
          <div className="blog-main-hero-content">
            <span className="blog-main-badge">Appointopia Blog</span>
            <h1>
              Insights, Tips, and <br />
              <span className="blog-main-highlight">Industry News</span>
            </h1>
            <p>
              Stay updated with the latest trends, best practices, and expert advice
              from the Appointopia team.
            </p>
            <div className="blog-main-search">
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="blog-main-search-input"
              />
              <button className="blog-main-search-btn">
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="blog-main-featured">
            <div className="blog-main-featured-content">
              <span className="blog-main-featured-badge">Featured Article</span>
              <div className="blog-main-featured-card">
                <div className="blog-main-featured-info">
                  <div className="blog-main-featured-meta">
                    <span className="blog-main-featured-category">{featuredPost.category}</span>
                    <span className="blog-main-featured-date">
                      <FaCalendarAlt /> {featuredPost.date}
                    </span>
                  </div>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <div className="blog-main-featured-footer">
                    <div className="blog-main-featured-author">
                      <FaUser /> {featuredPost.author}
                    </div>
                    <div className="blog-main-featured-readtime">
                      <FaClock /> {featuredPost.readTime}
                    </div>
                  </div>
                  <Link to="/blog/featured" className="blog-main-featured-link">
                    Read Full Article <FaArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="blog-main-categories">
          <div className="blog-main-categories-header">
            <h2>Explore by Category</h2>
            <p>Find articles that match your interests.</p>
          </div>

          <div className="blog-main-categories-grid">
            <Link to="/blog/category/productivity" className="blog-main-category-card">
              <span className="blog-main-category-icon">🚀</span>
              <h3>Productivity</h3>
              <p>12 articles</p>
            </Link>
            <Link to="/blog/category/technology" className="blog-main-category-card">
              <span className="blog-main-category-icon">⚡</span>
              <h3>Technology</h3>
              <p>8 articles</p>
            </Link>
            <Link to="/blog/category/remote-work" className="blog-main-category-card">
              <span className="blog-main-category-icon">🌍</span>
              <h3>Remote Work</h3>
              <p>6 articles</p>
            </Link>
            <Link to="/blog/category/collaboration" className="blog-main-category-card">
              <span className="blog-main-category-icon">🤝</span>
              <h3>Collaboration</h3>
              <p>10 articles</p>
            </Link>
          </div>
        </section>

        {/* All Posts */}
        <section className="blog-main-posts">
          <div className="blog-main-posts-header">
            <h2>Latest Articles</h2>
            <p>Stay up to date with our latest content.</p>
          </div>

          <div className="blog-main-posts-grid">
            {regularPosts.map((post, index) => (
              <div key={index} className="blog-main-post-card">
                <div className="blog-main-post-tag">{post.category}</div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-main-post-meta">
                  <span className="blog-main-post-author">
                    <FaUser /> {post.author}
                  </span>
                  <span className="blog-main-post-date">
                    <FaCalendarAlt /> {post.date}
                  </span>
                </div>
                <Link to={`/blog/post/${index}`} className="blog-main-post-link">
                  Read More <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>

          <div className="blog-main-load-more">
            <button className="blog-main-load-btn">Load More Articles</button>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="blog-main-newsletter">
          <div className="blog-main-newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest articles and insights delivered to your inbox.</p>
            <form className="blog-main-newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="blog-main-newsletter-input"
              />
              <button type="submit" className="blog-main-newsletter-btn">
                Subscribe <FaArrowRight />
              </button>
            </form>
          </div>
        </section>

        {/* CTA Section */}
        <section className="blog-main-cta">
          <div className="blog-main-cta-content">
            <h2>Ready to Transform Your Scheduling?</h2>
            <p>Join thousands of professionals who trust Appointopia.</p>
            <div className="blog-main-cta-actions">
              <Link to="/signup" className="blog-main-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="blog-main-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
      
    </>
  );
}