// src/pages/About/AboutUs.jsx
import React from 'react';
import '../Page.css'

export default function AboutUs() {
  return (
    <div className="page-container">
      <h1>About Us</h1>
      <p>We're on a mission to simplify scheduling for everyone.</p>
      <div className="about-content">
        <div className="about-section">
          <h3>Our Story</h3>
          <p>Founded in 2024, Appointopia started with a simple idea: scheduling should be easy. Today, we help thousands of teams manage their time effectively.</p>
        </div>
        <div className="about-section">
          <h3>Our Values</h3>
          <ul>
            <li> Innovation</li>
            <li> Customer-first</li>
            <li> Global community</li>
            <li>Continuous improvement</li>
          </ul>
        </div>
      </div>
    </div>
  );
}