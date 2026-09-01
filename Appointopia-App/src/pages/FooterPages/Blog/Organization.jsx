// src/pages/Blog/Organization.jsx
import React from 'react';
import '../Page.css'

export default function Organization() {
  return (
    <div className="page-container">
      <h1>Organization Blog</h1>
      <p>Enterprise-level insights and best practices.</p>
      <div className="blog-list">
        <div className="blog-post">
          <h3>Enterprise Scheduling Solutions</h3>
          <p>How large organizations manage complex scheduling.</p>
        </div>
        <div className="blog-post">
          <h3>Team Productivity at Scale</h3>
          <p>Strategies for maintaining productivity across large teams.</p>
        </div>
      </div>
    </div>
  );
}