// src/pages/Resource/Webinars.jsx
import React from 'react';
import '../Page.css'

export default function Webinars() {
  return (
    <div className="page-container">
      <h1>Webinars</h1>
      <p>Live and recorded sessions to help you succeed.</p>
      <div className="webinar-list">
        <div className="webinar-item">
          <h3>Mastering Appointopia</h3>
          <p>Feb 10, 2026 | 10:00 AM EST</p>
          <button className="btn-secondary">Register</button>
        </div>
        <div className="webinar-item">
          <h3>Team Collaboration 101</h3>
          <p>Feb 15, 2026 | 2:00 PM EST</p>
          <button className="btn-secondary">Register</button>
        </div>
      </div>
    </div>
  );
}