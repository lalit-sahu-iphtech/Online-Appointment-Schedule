// src/pages/Legal/Terms.jsx
import { Link } from "react-router-dom";
import { 
  FaFileContract, 
  FaGavel, 
  FaUserCheck, 
  FaCreditCard,
  FaArrowRight,
  FaCheckCircle,
  FaClock
} from "react-icons/fa";
import "./legal.css";

export default function Terms() {
  return (
    <>
      <div className="legal-page">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="legal-hero-content">
            <span className="legal-badge">Terms of Service</span>
            <h1>
              Our Commitment to <br />
              <span className="legal-highlight">Transparency</span>
            </h1>
            <p>
              Please read these terms carefully before using our services. By using Appointopia,
              you agree to be bound by these terms and conditions.
            </p>
            <div className="legal-hero-meta">
              <span className="legal-hero-updated">Last Updated: January 2026</span>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="legal-content">
          <div className="legal-content-wrapper">
            <div className="legal-sidebar">
              <div className="legal-sidebar-sticky">
                <h3>On This Page</h3>
                <ul>
                  <li><a href="#section-1">Acceptance of Terms</a></li>
                  <li><a href="#section-2">User Responsibilities</a></li>
                  <li><a href="#section-3">Payment Terms</a></li>
                  <li><a href="#section-4">Termination</a></li>
                  <li><a href="#section-5">Intellectual Property</a></li>
                  <li><a href="#section-6">Limitation of Liability</a></li>
                </ul>
              </div>
            </div>

            <div className="legal-main">
              <div className="legal-section" id="section-1">
                <div className="legal-section-icon">
                  <FaFileContract />
                </div>
                <div>
                  <h2>Acceptance of Terms</h2>
                  <p>
                    By creating an account and using Appointopia, you agree to be bound by these
                    Terms of Service. If you do not agree to these terms, please do not use our
                    services.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> You must be at least 18 years old to use our services</li>
                    <li><FaCheckCircle /> You are responsible for maintaining account security</li>
                    <li><FaCheckCircle /> You agree to provide accurate and complete information</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-2">
                <div className="legal-section-icon">
                  <FaUserCheck />
                </div>
                <div>
                  <h2>User Responsibilities</h2>
                  <p>
                    Users are responsible for maintaining the confidentiality of their account
                    credentials and for all activities that occur under their account.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> Keep your password secure and confidential</li>
                    <li><FaCheckCircle /> Notify us immediately of any unauthorized use</li>
                    <li><FaCheckCircle /> Comply with all applicable laws and regulations</li>
                    <li><FaCheckCircle /> Use the service only for lawful purposes</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-3">
                <div className="legal-section-icon">
                  <FaCreditCard />
                </div>
                <div>
                  <h2>Payment Terms</h2>
                  <p>
                    Paid plans are billed on a monthly or annual basis, depending on your selected
                    subscription. Payments are non-refundable except as required by law.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> Monthly plans are billed on a recurring basis</li>
                    <li><FaCheckCircle /> Annual plans offer a discount on the monthly rate</li>
                    <li><FaCheckCircle /> You may cancel your subscription at any time</li>
                    <li><FaCheckCircle /> No refunds for partial billing periods</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-4">
                <div className="legal-section-icon">
                  <FaGavel />
                </div>
                <div>
                  <h2>Termination</h2>
                  <p>
                    We reserve the right to suspend or terminate your account for violation of
                    these terms, without prior notice.
                  </p>
                  <ul className="legal-list">
                    <li><FaCheckCircle /> Accounts may be terminated for violation of terms</li>
                    <li><FaCheckCircle /> You may delete your account at any time</li>
                    <li><FaCheckCircle /> Terminated accounts lose access to all data</li>
                  </ul>
                </div>
              </div>

              <div className="legal-section" id="section-5">
                <div className="legal-section-icon">
                  <FaFileContract />
                </div>
                <div>
                  <h2>Intellectual Property</h2>
                  <p>
                    All content, features, and functionality of Appointopia are owned by
                    Appointopia Inc. and are protected by intellectual property laws.
                  </p>
                </div>
              </div>

              <div className="legal-section" id="section-6">
                <div className="legal-section-icon">
                  <FaGavel />
                </div>
                <div>
                  <h2>Limitation of Liability</h2>
                  <p>
                    Appointopia is provided "as is" without warranties of any kind. We are not
                    liable for any damages arising from your use of our services.
                  </p>
                </div>
              </div>

              <div className="legal-footer-note">
                <p>These Terms of Service were last updated on January 15, 2026. We may update these terms from time to time. Continued use of our services constitutes acceptance of any changes.</p>
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