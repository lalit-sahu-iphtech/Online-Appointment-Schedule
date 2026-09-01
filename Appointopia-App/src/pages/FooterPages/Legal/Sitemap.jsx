// src/pages/Legal/Sitemap.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../Page.css'

export default function Sitemap() {
  return (
    <div className="page-container">
      <h1>Sitemap</h1>
      <div className="sitemap-grid">
        <div className="sitemap-column">
          <h3>Product</h3>
          <Link to="/features">Features</Link>
          <Link to="/pricing">Pricing</Link>
        </div>
        <div className="sitemap-column">
          <h3>Resource</h3>
          <Link to="/blog">Blog</Link>
          <Link to="/user-guides">User Guides</Link>
          <Link to="/webinars">Webinars</Link>
        </div>
        <div className="sitemap-column">
          <h3>About</h3>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div className="sitemap-column">
          <h3>Blog</h3>
          <Link to="/blog/personal">Personal</Link>
          <Link to="/blog/startup">Startup</Link>
          <Link to="/blog/organization">Organization</Link>
        </div>
        <div className="sitemap-column">
          <h3>Legal</h3>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </div>
  );
}