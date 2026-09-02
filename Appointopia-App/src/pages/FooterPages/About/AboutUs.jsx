// src/pages/About/AboutUs.jsx
import { Link } from "react-router-dom";
import { 
  FaRocket, 
  FaUsers, 
  FaHeart, 
  FaLightbulb, 
  FaHandshake, 
  FaGlobe,
  FaArrowRight,
  FaAward,
  FaShieldAlt,
  FaStar
} from "react-icons/fa";
import "./aboutUs.css";


export default function AboutUs() {
  return (
    <>
      {/* <Navbar/> */}
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <span className="about-badge">About Appointopia</span>
            <h1>
              We're on a Mission to <br />
              <span className="about-highlight">Simplify Scheduling</span>
            </h1>
            <p>
              Appointopia was founded with a simple belief: scheduling should be effortless. 
              Today, we help thousands of teams and professionals manage their time effectively.
            </p>
            <div className="about-hero-actions">
              <Link to="/signup" className="about-btn-primary">
                Get Started <FaArrowRight />
              </Link>
              <Link to="/contact" className="about-btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="about-mission">
          <div className="about-mission-content">
            <div className="about-mission-text">
              <span className="about-mission-badge">Our Mission</span>
              <h2>Making Time Management Simple for Everyone</h2>
              <p>
                We believe that time is your most valuable asset. Our mission is to eliminate 
                the chaos of scheduling and help professionals reclaim their time. We combine 
                intelligent automation with a beautiful, intuitive interface to create a 
                scheduling experience that actually works for you.
              </p>
              <div className="about-mission-stats">
                <div className="about-mission-stat">
                  <span className="about-mission-number">50K+</span>
                  <span className="about-mission-label">Meetings Scheduled</span>
                </div>
                <div className="about-mission-stat">
                  <span className="about-mission-number">98%</span>
                  <span className="about-mission-label">User Satisfaction</span>
                </div>
                <div className="about-mission-stat">
                  <span className="about-mission-number">4.9</span>
                  <span className="about-mission-label">Average Rating</span>
                </div>
              </div>
            </div>
            <div className="about-mission-image">
              <div className="about-mission-card">
                <div className="about-mission-card-header">
                  <FaRocket className="about-mission-card-icon" />
                  <h3>Built for the Future</h3>
                </div>
                <p>AI-powered scheduling that adapts to your workflow and grows with you.</p>
                <div className="about-mission-card-features">
                  <span><FaShieldAlt /> Enterprise Security</span>
                  <span><FaHandshake /> Trusted by Teams</span>
                  <span><FaAward /> Industry Leading</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="about-story">
          <div className="about-story-header">
            <span className="about-story-badge">Our Story</span>
            <h2>The Journey Behind Appointopia</h2>
            <p>From a simple idea to a platform that powers thousands of businesses.</p>
          </div>

          <div className="about-story-grid">
            <div className="about-story-card">
              <div className="about-story-number">01</div>
              <h3>The Beginning</h3>
              <p>
                Founded in 2024, Appointopia started with a simple idea: scheduling 
                should be easy. Our founders experienced the frustration of manual 
                scheduling and decided to build a better solution.
              </p>
            </div>
            <div className="about-story-card">
              <div className="about-story-number">02</div>
              <h3>Building the Product</h3>
              <p>
                We spent months listening to users, iterating on designs, and 
                building a platform that truly solves the scheduling challenges 
                faced by professionals and teams.
              </p>
            </div>
            <div className="about-story-card">
              <div className="about-story-number">03</div>
              <h3>Growing Together</h3>
              <p>
                Today, Appointopia serves thousands of users worldwide. We continue 
                to innovate and improve, always keeping our users at the center of 
                everything we do.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="about-values-header">
            <span className="about-values-badge">Core Values</span>
            <h2>What Drives Us</h2>
            <p>The principles that guide everything we do at Appointopia.</p>
          </div>

          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="about-value-icon purple">
                <FaLightbulb />
              </div>
              <h3>Innovation</h3>
              <p>We continuously push boundaries to bring you cutting-edge scheduling solutions.</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon blue">
                <FaHandshake />
              </div>
              <h3>Integrity</h3>
              <p>We build trust through transparency, honesty, and ethical practices.</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon red">
                <FaHeart />
              </div>
              <h3>Customer Success</h3>
              <p>Your success is our success. We're committed to helping you achieve more.</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon green">
                <FaUsers />
              </div>
              <h3>Teamwork</h3>
              <p>We believe in the power of collaboration and diverse perspectives.</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon orange">
                <FaRocket />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we build and deliver.</p>
            </div>

            <div className="about-value-card">
              <div className="about-value-icon teal">
                <FaGlobe />
              </div>
              <h3>Global Community</h3>
              <p>We serve a diverse global community and celebrate the unique perspectives they bring.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="about-team-header">
            <span className="about-team-badge">Leadership</span>
            <h2>Meet the Team Behind Appointopia</h2>
            <p>Passionate individuals dedicated to building a product you'll love.</p>
          </div>

          <div className="about-team-grid">
            <div className="about-team-card">
              <div className="about-team-avatar">
                <span className="about-team-initials">JD</span>
              </div>
              <h3>John Doe</h3>
              <span className="about-team-role">CEO & Founder</span>
              <p>15+ years of experience in product development and team leadership.</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-avatar">
                <span className="about-team-initials">JS</span>
              </div>
              <h3>Jane Smith</h3>
              <span className="about-team-role">CTO</span>
              <p>Technology visionary with a passion for building scalable solutions.</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-avatar">
                <span className="about-team-initials">AR</span>
              </div>
              <h3>Alex Rivera</h3>
              <span className="about-team-role">Head of Design</span>
              <p>Award-winning designer focused on creating intuitive user experiences.</p>
            </div>

            <div className="about-team-card">
              <div className="about-team-avatar">
                <span className="about-team-initials">MK</span>
              </div>
              <h3>Maya Kumar</h3>
              <span className="about-team-role">Head of Marketing</span>
              <p>Strategic marketer passionate about connecting with users and building community.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <div className="about-cta-content">
            <h2>Ready to Transform Your Scheduling?</h2>
            <p>Join thousands of professionals who trust Appointopia to manage their appointments.</p>
            <div className="about-cta-actions">
              <Link to="/signup" className="about-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="about-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
     
    </>
  );
}