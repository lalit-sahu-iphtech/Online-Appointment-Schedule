// src/pages/CompanyPage.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  FaRocket, 
  FaUsers, 
  FaHeart, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaGlobe,
  FaArrowRight,
  FaLightbulb,
  FaHandshake,
  FaShieldAlt,
  FaAward,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./companyPage.css";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

export default function CompanyPage() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Validation errors
  const [errors, setErrors] = useState({});
  
  // Success message
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear success message when user types
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Subject must be at least 3 characters";
    }
    
    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset messages
    setSuccessMessage("");
    
    // Validate form
    if (!validateForm()) {
      console.log("❌ Form validation failed:", errors);
      return;
    }
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Log form data to console
      console.log("✅ Form submitted successfully!");
      console.log("📋 Form Data:", {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        submittedAt: new Date().toISOString()
      });
      
      // Show success message
      setSuccessMessage("Thank you for your message! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      // Reset submitting state
      setIsSubmitting(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      
    }, 1500);
  };

  // Social media click handler
  const handleSocialClick = (platform, url) => {
    console.log(`🔗 ${platform} icon clicked`);
    console.log(`🌐 Opening: ${url}`);
    window.open(url, '_blank');
  };

  return (
    <>
      <Navbar />
      <div className="company-page">
        {/* Hero Section */}
        <section className="company-hero">
          <div className="company-hero-content">
            <span className="company-badge">About Us</span>
            <h1>
              Empowering Professionals to <br />
              <span className="company-highlight">Master Their Schedule</span>
            </h1>
            <p>
              We believe that time is your most valuable asset. Our mission is to 
              simplify appointment scheduling so you can focus on what truly matters.
            </p>
            <div className="company-hero-actions">
              <Link to="/contact" className="company-btn-primary">
                Get in Touch <FaArrowRight />
              </Link>
              <Link to="/careers" className="company-btn-secondary">
                Join Our Team
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="company-mission">
          <div className="company-mission-content">
            <div className="company-mission-text">
              <span className="company-mission-badge">Our Mission</span>
              <h2>Making Scheduling Simple for Everyone</h2>
              <p>
                Appointopia was founded with a single vision: to eliminate the chaos 
                of scheduling and help professionals reclaim their time. We combine 
                intelligent automation with a beautiful, intuitive interface to 
                create a scheduling experience that actually works for you.
              </p>
              <div className="company-mission-stats">
                <div className="company-mission-stat">
                  <span className="company-mission-number">50K+</span>
                  <span className="company-mission-label">Meetings Scheduled</span>
                </div>
                <div className="company-mission-stat">
                  <span className="company-mission-number">98%</span>
                  <span className="company-mission-label">User Satisfaction</span>
                </div>
                <div className="company-mission-stat">
                  <span className="company-mission-number">4.9</span>
                  <span className="company-mission-label">Average Rating</span>
                </div>
              </div>
            </div>
            <div className="company-mission-image">
              <div className="company-mission-card">
                <div className="company-mission-card-header">
                  <FaRocket className="company-mission-card-icon" />
                  <h3>Built for the Future</h3>
                </div>
                <p>AI-powered scheduling that adapts to your workflow.</p>
                <div className="company-mission-card-features">
                  <span><FaShieldAlt /> Enterprise Security</span>
                  <span><FaHandshake /> Trusted by Teams</span>
                  <span><FaAward /> Industry Leading</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="company-values">
          <div className="company-values-header">
            <span className="company-values-badge">Core Values</span>
            <h2>What Drives Us</h2>
            <p>The principles that guide everything we do at Appointopia.</p>
          </div>

          <div className="company-values-grid">
            <div className="company-value-card">
              <div className="company-value-icon purple">
                <FaLightbulb />
              </div>
              <h3>Innovation</h3>
              <p>We continuously push boundaries to bring you cutting-edge scheduling solutions.</p>
            </div>

            <div className="company-value-card">
              <div className="company-value-icon blue">
                <FaHandshake />
              </div>
              <h3>Integrity</h3>
              <p>We build trust through transparency, honesty, and ethical practices.</p>
            </div>

            <div className="company-value-card">
              <div className="company-value-icon red">
                <FaHeart />
              </div>
              <h3>Customer Success</h3>
              <p>Your success is our success. We're committed to helping you achieve more.</p>
            </div>

            <div className="company-value-card">
              <div className="company-value-icon green">
                <FaUsers />
              </div>
              <h3>Teamwork</h3>
              <p>We believe in the power of collaboration and diverse perspectives.</p>
            </div>

            <div className="company-value-card">
              <div className="company-value-icon orange">
                <FaRocket />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in everything we build and deliver.</p>
            </div>

            <div className="company-value-card">
              <div className="company-value-icon teal">
                <FaShieldAlt />
              </div>
              <h3>Security</h3>
              <p>Your data is protected with the highest standards of security and privacy.</p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="company-team">
          <div className="company-team-header">
            <span className="company-team-badge">Leadership</span>
            <h2>Meet the Team Behind Appointopia</h2>
            <p>Passionate individuals dedicated to building a product you'll love.</p>
          </div>

          <div className="company-team-grid">
            <div className="company-team-card">
              <div className="company-team-avatar">
                <span className="company-team-initials">JD</span>
              </div>
              <h3>John Doe</h3>
              <span className="company-team-role">CEO & Founder</span>
              <p>15+ years of experience in product development and team leadership.</p>
            </div>

            <div className="company-team-card">
              <div className="company-team-avatar">
                <span className="company-team-initials">JS</span>
              </div>
              <h3>Jane Smith</h3>
              <span className="company-team-role">CTO</span>
              <p>Technology visionary with a passion for building scalable solutions.</p>
            </div>

            <div className="company-team-card">
              <div className="company-team-avatar">
                <span className="company-team-initials">AR</span>
              </div>
              <h3>Alex Rivera</h3>
              <span className="company-team-role">Head of Design</span>
              <p>Award-winning designer focused on creating intuitive user experiences.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="company-contact">
          <div className="company-contact-content">
            <div className="company-contact-info">
              <span className="company-contact-badge">Get in Touch</span>
              <h2>Let's Connect</h2>
              <p>Have questions or want to learn more about Appointopia? We'd love to hear from you.</p>
              
              <div className="company-contact-details">
                <div className="company-contact-item">
                  <FaEnvelope className="company-contact-icon" />
                  <div>
                    <span className="company-contact-label">Email</span>
                    <span className="company-contact-value">hello@appointopia.com</span>
                  </div>
                </div>
                <div className="company-contact-item">
                  <FaPhone className="company-contact-icon" />
                  <div>
                    <span className="company-contact-label">Phone</span>
                    <span className="company-contact-value">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="company-contact-item">
                  <FaMapMarkerAlt className="company-contact-icon" />
                  <div>
                    <span className="company-contact-label">Location</span>
                    <span className="company-contact-value">San Francisco, CA</span>
                  </div>
                </div>
              </div>

              <div className="company-social-links">
                <a
                  href="#"
                  aria-label="Twitter"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialClick("Twitter", "https://twitter.com/appointopia");
                  }}
                  className="company-social-link"
                >
                  <FaTwitter />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialClick("LinkedIn", "https://linkedin.com/company/appointopia");
                  }}
                  className="company-social-link"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialClick("YouTube", "https://youtube.com/appointopia");
                  }}
                  className="company-social-link"
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  aria-label="Website"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSocialClick("Website", "https://appointopia.com");
                  }}
                  className="company-social-link"
                >
                  <FaGlobe />
                </a>
              </div>
            </div>

            <div className="company-contact-form">
              <h3>Send Us a Message</h3>
              
              {/* ✅ Success Message */}
              {successMessage && (
                <div className="company-form-success">
                  <FaCheckCircle className="company-form-success-icon" />
                  <span>{successMessage}</span>
                </div>
              )}
              
              <form className="company-form" onSubmit={handleSubmit} noValidate>
                <div className="company-form-row">
                  <div className="company-form-group">
                    <label>Full Name <span className="required-star">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={errors.name ? "input-error" : ""}
                    />
                    {errors.name && (
                      <span className="form-error-text">
                        <FaExclamationCircle /> {errors.name}
                      </span>
                    )}
                  </div>
                  <div className="company-form-group">
                    <label>Email Address <span className="required-star">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={errors.email ? "input-error" : ""}
                    />
                    {errors.email && (
                      <span className="form-error-text">
                        <FaExclamationCircle /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>
                <div className="company-form-group">
                  <label>Subject <span className="required-star">*</span></label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={errors.subject ? "input-error" : ""}
                  />
                  {errors.subject && (
                    <span className="form-error-text">
                      <FaExclamationCircle /> {errors.subject}
                    </span>
                  )}
                </div>
                <div className="company-form-group">
                  <label>Message <span className="required-star">*</span></label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className={errors.message ? "input-error" : ""}
                  />
                  {errors.message && (
                    <span className="form-error-text">
                      <FaExclamationCircle /> {errors.message}
                    </span>
                  )}
                </div>
                <button 
                  type="submit" 
                  className="company-form-btn" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"} 
                  {!isSubmitting && <FaArrowRight />}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="company-cta">
          <div className="company-cta-content">
            <h2>Ready to Transform Your Scheduling?</h2>
            <p>Join thousands of professionals who trust Appointopia to manage their appointments.</p>
            <div className="company-cta-actions">
              <Link to="/signup" className="company-btn-primary">
                Start Free Trial <FaArrowRight />
              </Link>
              <Link to="/pricing" className="company-btn-outline">
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}