// src/pages/Blog/Startup.jsx
import React from 'react';
import '../Page.css'

export default function Startup() {
  return (
    <div className="page-container">
      <h1>Startup Blog</h1>
      <p>Insights for founders and startup teams.</p>
      <div className="blog-list">
        <div className="blog-post">
          <h3>Scaling Your Startup Team</h3>
          <p>Best practices for growing your team effectively.</p>
        </div>
        <div className="blog-post">
          <h3>Product-Market Fit</h3>
          <p>How to know when you've found your perfect market.</p>
        </div>
      </div>
    </div>
  );
}