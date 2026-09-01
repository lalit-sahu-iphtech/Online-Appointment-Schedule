
import React from 'react';
import '../Page.css'

export default function Pricing() {
  return (
    <div className="page-container">
      <h1>Pricing</h1>
      <p>Choose the plan that fits your needs.</p>
      <div className="pricing-grid">
        <div className="pricing-card">
          <h3>Free</h3>
          <p className="price">$0</p>
          <ul>
            <li>Basic scheduling</li>
            <li>5 team members</li>
            <li>Email support</li>
          </ul>
          <button className="btn-primary">Get Started</button>
        </div>
        <div className="pricing-card popular">
          <h3>Pro</h3>
          <p className="price">$12/mo</p>
          <ul>
            <li>Advanced scheduling</li>
            <li>Unlimited team members</li>
            <li>Priority support</li>
            <li>Analytics</li>
          </ul>
          <button className="btn-primary">Start Free Trial</button>
        </div>
        <div className="pricing-card">
          <h3>Enterprise</h3>
          <p className="price">Custom</p>
          <ul>
            <li>Everything in Pro</li>
            <li>Dedicated account manager</li>
            <li>Custom integrations</li>
            <li>SSO & security</li>
          </ul>
          <button className="btn-primary">Contact Sales</button>
        </div>
      </div>
    </div>
  );
}