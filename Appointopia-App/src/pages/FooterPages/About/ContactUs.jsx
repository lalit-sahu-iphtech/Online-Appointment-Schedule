// src/pages/Contact/ContactUs.jsx
import { useState } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaArrowRight,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaGlobe
} from "react-icons/fa";
import "./contactUs.css";



export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      console.log("Contact form submitted:");
      console.log({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: new Date().toISOString()
      });

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  return (
    <>
 
      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <span className="contact-badge">Get in Touch</span>
            <h1>
              We'd Love to <br />
              <span className="contact-highlight">Hear From You</span>
            </h1>
            <p>
              Have questions, feedback, or need support? Reach out to us and 
              we'll get back to you as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-info-header">
                <span className="contact-info-badge">Contact Information</span>
                <h2>Let's Connect</h2>
                <p>We're here to help and answer any questions you might have.</p>
              </div>

              <div className="contact-info-details">
                <div className="contact-info-item">
                  <div className="contact-info-icon purple">
                    <FaEnvelope />
                  </div>
                  <div>
                    <span className="contact-info-label">Email</span>
                    <span className="contact-info-value">support@appointopia.com</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon blue">
                    <FaPhone />
                  </div>
                  <div>
                    <span className="contact-info-label">Phone</span>
                    <span className="contact-info-value">+1 (555) 123-4567</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon green">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <span className="contact-info-label">Location</span>
                    <span className="contact-info-value">San Francisco, CA, USA</span>
                  </div>
                </div>
              </div>

              <div className="contact-hours">
                <h4>
                  <FaClock className="contact-hours-icon" />
                  Business Hours
                </h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 2:00 PM</p>
                <p>Sunday: Closed</p>
              </div>

              <div className="contact-social">
                <span>Follow us</span>
                <div className="contact-social-links">
                  <a href="#" className="contact-social-link"><FaTwitter /></a>
                  <a href="#" className="contact-social-link"><FaLinkedin /></a>
                  <a href="#" className="contact-social-link"><FaYoutube /></a>
                  <a href="#" className="contact-social-link"><FaGlobe /></a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <div className="contact-form-card">
                <h3>Send Us a Message</h3>

                {submitStatus === "success" && (
                  <div className="contact-success">
                    <FaCheckCircle className="contact-success-icon" />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="contact-form-row">
                    <div className="contact-form-group">
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
                    <div className="contact-form-group">
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

                  <div className="contact-form-group">
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

                  <div className="contact-form-group">
                    <label>Message <span className="required-star">*</span></label>
                    <textarea
                      name="message"
                      rows="5"
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
                    className="contact-submit-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <FaArrowRight />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="contact-map">
          <div className="contact-map-placeholder">
            <div className="contact-map-content">
              <FaMapMarkerAlt className="contact-map-icon" />
              <h3>Find Us Here</h3>
              <p>123 Main Street, San Francisco, CA 94105</p>
              <span className="contact-map-note">Map view coming soon</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="contact-cta">
          <div className="contact-cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users and transform your scheduling today.</p>
            <div className="contact-cta-actions">
              <a href="/signup" className="contact-btn-primary">
                Start Free Trial <FaArrowRight />
              </a>
              <a href="/pricing" className="contact-btn-outline">
                View Pricing
              </a>
            </div>
          </div>
        </section>
      </div>
     
    </>
  );
}