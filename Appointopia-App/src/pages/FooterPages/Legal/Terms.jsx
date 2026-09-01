
import React from 'react';
import '../Page.css'

export default function Terms() {
  return (
    <div className="page-container">
      <h1>Terms of Service</h1>
      <p>Last updated: January 2026</p>
      <div className="legal-content">
        <section>
          <h3>Acceptance of Terms</h3>
          <p>By using Appointopia, you agree to these terms and conditions.</p>
        </section>
        <section>
          <h3>User Responsibilities</h3>
          <p>Users must provide accurate information and maintain account security.</p>
        </section>
        <section>
          <h3>Payment Terms</h3>
          <p>Paid plans are billed monthly or annually as per your selected subscription.</p>
        </section>
        <section>
          <h3>Termination</h3>
          <p>We reserve the right to suspend or terminate accounts for violation of terms.</p>
        </section>
      </div>
    </div>
  );
}