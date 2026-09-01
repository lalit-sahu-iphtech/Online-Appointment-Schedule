// src/pages/Blog/Personal.jsx
import React from 'react';
import '../Page.css'

export default function Personal() {
  return (
    <div className="page-container">
      <h1>Personal Blog</h1>
      <p>Tips for personal productivity and time management.</p>
      <div className="blog-list">
        <div className="blog-post">
          <h3>How to Plan Your Perfect Day</h3>
          <p>A step-by-step guide to maximizing your daily productivity.</p>
        </div>
        <div className="blog-post">
          <h3>Balancing Work and Life</h3>
          <p>Strategies for maintaining a healthy work-life balance.</p>
        </div>
      </div>
    </div>
  );
}