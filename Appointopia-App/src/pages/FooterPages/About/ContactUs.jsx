// src/pages/FooterPages/About/ContactUs.jsx
import React, { useState } from 'react';
import '../Page.css';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };
    let isValid = true;

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate Message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      console.log(' Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      console.log(' Sending message...');
      console.log(' Form Data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Success
      console.log('✅ Message sent successfully!');
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        message: ''
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error(' Error sending message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Contact Us</h1>
      <p>We'd love to hear from you. Reach out anytime.</p>
      
      <div className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Message Field */}
          <div className="form-group">
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              className={errors.message ? 'input-error' : ''}
            ></textarea>
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="success-message">
               Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="error-message">
               Failed to send message. Please try again.
            </div>
          )}
        </form>

        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p> support@appointopia.com</p>
          <p> +1 (555) 123-4567</p>
          <p> San Francisco, CA</p>
          
          <div className="contact-hours">
            <h4>Business Hours</h4>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 2:00 PM</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  );
}