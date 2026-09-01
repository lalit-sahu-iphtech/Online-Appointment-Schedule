// src/pages/Resource/UserGuides.jsx
import React from 'react';
import '../Page.css'

export default function UserGuides() {
  return (
    <div className="page-container">
      <h1>User Guides</h1>
      <p>Comprehensive guides to help you get started with Appointopia.</p>
      <div className="guide-list">
        <div className="guide-item">
          <h3>Getting Started</h3>
          <p>Learn the basics of Appointopia in 5 minutes.</p>
        </div>
        <div className="guide-item">
          <h3>Advanced Features</h3>
          <p>Master scheduling with advanced tools.</p>
        </div>
        <div className="guide-item">
          <h3>Troubleshooting</h3>
          <p>Common issues and how to fix them.</p>
        </div>
      </div>
    </div>
  );
}