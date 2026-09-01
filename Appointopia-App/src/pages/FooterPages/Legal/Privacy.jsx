
import React from 'react';
import '../Page.css'

export default function Privacy() {
  return (
    <div className="page-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: January 2026</p>
      <div className="legal-content">
        <section>
          <h3>Information We Collect</h3>
          <p>We collect information you provide directly, such as name, email, and payment details.</p>
        </section>
        <section>
          <h3>How We Use Information</h3>
          <p>We use your data to provide services, improve our platform, and communicate with you.</p>
        </section>
        <section>
          <h3>Data Security</h3>
          <p>We implement industry-standard security measures to protect your data.</p>
        </section>
        <section>
          <h3>Your Rights</h3>
          <p>You have the right to access, correct, or delete your data at any time.</p>
        </section>
      </div>
    </div>
  );
}