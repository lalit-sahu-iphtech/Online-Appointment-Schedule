// src/pages/CompanyPage.jsx
import { Link } from "react-router-dom";
import "./companyPage.css";

export default function CompanyPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Company</h1>
        <p>Learn more about who we are and what we do.</p>
        
        <div className="company-info">
          <div className="company-section">
            <h3> Our Mission</h3>
            <p>To simplify appointment scheduling for professionals worldwide.</p>
          </div>
          <div className="company-section">
            <h3> Our Team</h3>
            <p>Passionate individuals dedicated to building great products.</p>
          </div>
          <div className="company-section">
            <h3>Our Values</h3>
            <p>Innovation, Integrity, and Customer Success.</p>
          </div>
          <div className="company-section">
            <h3> Contact Us</h3>
            <p>Email: hello@appointopia.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}