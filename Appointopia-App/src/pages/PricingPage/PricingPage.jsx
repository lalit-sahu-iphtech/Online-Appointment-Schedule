// src/pages/PricingPage.jsx
import { Link } from "react-router-dom";
import "./pricingPage.css";

export default function PricingPage() {
  return (
    <div className="page-container">
      <div className="page-content">
        <h1>Pricing</h1>
        <p>Choose the perfect plan for your needs.</p>
        
        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Free</h3>
            <div className="price">$0</div>
            <ul>
              <li>✓ Up to 10 meetings/month</li>
              <li>✓ Basic scheduling</li>
              <li>✓ Email notifications</li>
              <li>✗ Advanced analytics</li>
            </ul>
            <button className="pricing-btn">Get Started</button>
          </div>
          
          <div className="pricing-card popular">
            <span className="popular-badge">Most Popular</span>
            <h3>Pro</h3>
            <div className="price">$19</div>
            <ul>
              <li>✓ Up to 100 meetings/month</li>
              <li>✓ Smart scheduling</li>
              <li>✓ Email & SMS notifications</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Team collaboration</li>
            </ul>
            <button className="pricing-btn primary">Start Free Trial</button>
          </div>
          
          <div className="pricing-card">
            <h3>Enterprise</h3>
            <div className="price">$49</div>
            <ul>
              <li>✓ Unlimited meetings</li>
              <li>✓ AI-powered scheduling</li>
              <li>✓ All notifications</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Dedicated support</li>
              <li>✓ Custom integrations</li>
            </ul>
            <button className="pricing-btn">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
}