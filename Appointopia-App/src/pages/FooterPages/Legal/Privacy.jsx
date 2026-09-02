// src/pages/Legal/Privacy.jsx
import { Link } from "react-router-dom";
import { 
  FaShieldAlt, 
  FaLock, 
  FaUserSecret, 
  FaDatabase,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import "./legal.css";


export default function Privacy() {
  return (
    <>
      
      <div className="legal-page">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="legal-hero-content">
            <span className="legal-badge">Privacy Policy</span>
            <h1>
              Your Privacy Matters <br />
              <span className="legal-highlight">to Us</span>
            </h1>
            <p>
              We are committed to protecting your personal information and being transparent
              about how we collect, use, and safeguard your data.
            </p>
            <div className="legal-hero-meta">
              <span className="legal-hero-updated">Last Updated: January 2026</span>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section className="legal-content">
          <div className="legal-content-wrapper">
            <div className="legal-sidebar">
              <div className="legal-sidebar-sticky">
                <h3>On This Page</h3>
                <ul>
                  <li><a href="#section-1">Information We Collect</a></li>
                  <li><a href="#section-2">How We Use Information</a></li>
                  <li><a href="#section-3">Data Security</a></li>
                  <li><a href="#section-4">Your Rights</a></li>
                  <li><a href="#section-5">Cookies</a></li>
                  <li><a href="#section-6">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="legal-main">
              <div className="legal-section" id="section-1">
                <div className="legal-section-icon">
                  <FaDatabase />
                </div>
                <div>
                  <h2>Information We Collect</h2>
                  <p>
                    We collect information you provide directly, such as your name, email address,
                    payment details, and any other information you choose to provide when using
                    our services.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> Account information (name, email, password)</li>
                    <li><FaCheckCircle /> Payment and billing information</li>
                    <li><FaCheckCircle /> Usage data and preferences</li>
                    <li><FaCheckCircle /> Communications with our support team</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-2">
                <div className="legal-section-icon">
                  <FaUserSecret />
                </div>
                <div>
                  <h2>How We Use Information</h2>
                  <p>
                    We use your data to provide, maintain, and improve our services, as well as
                    to communicate with you and ensure the security of our platform.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> To provide and deliver our services</li>
                    <li><FaCheckCircle /> To improve and personalize your experience</li>
                    <li><FaCheckCircle /> To communicate with you about updates and offers</li>
                    <li><FaCheckCircle /> To ensure security and prevent fraud</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-3">
                <div className="legal-section-icon">
                  <FaLock />
                </div>
                <div>
                  <h2>Data Security</h2>
                  <p>
                    We implement industry-standard security measures to protect your personal
                    information from unauthorized access, disclosure, alteration, or destruction.
                  </p>
                  <div className="legal-security-badges">
                    <span>End-to-End Encryption</span>
                    <span>Secure Data Storage</span>
                    <span>Regular Security Audits</span>
                    <span>GDPR Compliant</span>
                  </div>
                </div>
              </div>

              <div className="legal-section" id="section-4">
                <div className="legal-section-icon">
                  <FaShieldAlt />
                </div>
                <div>
                  <h2>Your Rights</h2>
                  <p>
                    You have the right to access, correct, or delete your personal data at any time.
                    You may also request a copy of your data or restrict its processing.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> Right to access your data</li>
                    <li><FaCheckCircle /> Right to correct inaccurate data</li>
                    <li><FaCheckCircle /> Right to delete your data</li>
                    <li><FaCheckCircle /> Right to data portability</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-5">
                <div className="legal-section-icon">
                  <FaDatabase />
                </div>
                <div>
                  <h2>Cookies</h2>
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience,
                    analyze usage, and deliver personalized content.
                  </p>
                </div>
              </div>

              <div className="legal-section" id="section-6">
                <div className="legal-section-icon">
                  <FaShieldAlt />
                </div>
                <div>
                  <h2>Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="legal-contact-info">
                    <p><strong>Email:</strong> privacy@appointopia.com</p>
                    <p><strong>Address:</strong> 123 Main Street, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              <div className="legal-footer-note">
                <p>This Privacy Policy was last updated on January 15, 2026. We may update this policy from time to time. Please check back regularly for any changes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="legal-cta">
          <div className="legal-cta-content">
            <h2>Ready to Get Started with Appointopia?</h2>
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