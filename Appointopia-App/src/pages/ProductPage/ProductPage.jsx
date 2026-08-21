// src/pages/ProductPage.jsx
import { Link } from "react-router-dom";
import "./productPage.css";

export default function ProductPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Product</h1>
        <p>Discover our powerful appointment scheduling platform.</p>
        
        <div className="page-features">
          <div className="feature-card">
            <h3>Smart Scheduling</h3>
            <p>Automated scheduling with intelligent time slot recommendations.</p>
          </div>
          <div className="feature-card">
            <h3> Real-time Notifications</h3>
            <p>Get instant updates and reminders for your appointments.</p>
          </div>
          <div className="feature-card">
            <h3> Analytics Dashboard</h3>
            <p>Track your meetings, bookings, and performance metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}