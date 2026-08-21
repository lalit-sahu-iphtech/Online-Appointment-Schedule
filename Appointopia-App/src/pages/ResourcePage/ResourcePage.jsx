// src/pages/ResourcePage.jsx
import { Link } from "react-router-dom";
import "./resourcePage.css";

export default function ResourcePage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Resources</h1>
        <p>Everything you need to master appointment scheduling.</p>
        
        <div className="page-resources">
          <div className="resource-item">
            <h3> Documentation</h3>
            <p>Complete guides and API references.</p>
          </div>
          <div className="resource-item">
            <h3> Video Tutorials</h3>
            <p>Step-by-step video guides for all features.</p>
          </div>
          <div className="resource-item">
            <h3> Blog & Articles</h3>
            <p>Tips, tricks, and best practices.</p>
          </div>
          <div className="resource-item">
            <h3> FAQ</h3>
            <p>Frequently asked questions answered.</p>
          </div>
        </div>
      </div>
    </div>
  );
}