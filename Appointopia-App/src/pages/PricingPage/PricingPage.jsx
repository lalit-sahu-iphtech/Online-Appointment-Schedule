import { Link } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaArrowRight, 
  FaRocket, 
  FaUsers, 
  FaBuilding,
  FaStar,
  FaCrown
} from "react-icons/fa";
import "./pricingPage.css";
import Navbar from "../../component/Navbar/Navbar";
import Footer from "../../component/Footer/Footer";

export default function PricingPage() {
  return (
    <>
    <Navbar/>
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="pricing-hero-content">
          <span className="pricing-badge">Pricing Plans</span>
          <h1>
            Choose the Perfect Plan for <br />
            <span className="pricing-highlight">Your Scheduling Needs</span>
          </h1>
          <p>
            Start with our free plan and upgrade as you grow. No hidden fees,
            cancel anytime.
          </p>
          <div className="pricing-toggle">
            <button className="pricing-toggle-btn active">Monthly</button>
            <button className="pricing-toggle-btn">Annual</button>
            <span className="pricing-toggle-save">Save 20%</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pricing-cards">
        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-icon">
              <FaRocket />
            </div>
            <h3>Starter</h3>
            <div className="pricing-card-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">0</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-card-description">
              Perfect for individuals getting started with scheduling.
            </p>
          </div>

          <ul className="pricing-features">
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Up to 10 meetings per month
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Basic scheduling tools
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Email notifications
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Calendar integration
            </li>
            <li className="pricing-feature-disabled">
              <FaCheckCircle className="pricing-feature-icon" />
              Advanced analytics
            </li>
            <li className="pricing-feature-disabled">
              <FaCheckCircle className="pricing-feature-icon" />
              Team collaboration
            </li>
          </ul>

          <Link to="/signup" className="pricing-btn">
            Get Started <FaArrowRight />
          </Link>
        </div>

        <div className="pricing-card popular">
          <div className="pricing-card-popular-badge">
            <FaStar /> Most Popular
          </div>
          <div className="pricing-card-header">
            <div className="pricing-card-icon pro">
              <FaUsers />
            </div>
            <h3>Professional</h3>
            <div className="pricing-card-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">19</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-card-description">
              Ideal for professionals and growing teams.
            </p>
          </div>

          <ul className="pricing-features">
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Up to 100 meetings per month
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Smart scheduling with AI
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Email & SMS notifications
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Advanced analytics dashboard
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Team collaboration tools
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Priority support
            </li>
          </ul>

          <Link to="/signup" className="pricing-btn primary">
            Start Free Trial <FaArrowRight />
          </Link>
        </div>

        <div className="pricing-card">
          <div className="pricing-card-header">
            <div className="pricing-card-icon enterprise">
              <FaBuilding />
            </div>
            <h3>Enterprise</h3>
            <div className="pricing-card-price">
              <span className="pricing-currency">$</span>
              <span className="pricing-amount">49</span>
              <span className="pricing-period">/month</span>
            </div>
            <p className="pricing-card-description">
              For large organizations with advanced needs.
            </p>
          </div>

          <ul className="pricing-features">
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Unlimited meetings
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              AI-powered scheduling
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              All notification channels
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Advanced analytics & insights
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Dedicated account manager
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              Custom integrations & API
            </li>
            <li>
              <FaCheckCircle className="pricing-feature-icon" />
              SSO & enterprise security
            </li>
          </ul>

          <Link to="/contact" className="pricing-btn">
            Contact Sales <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pricing-comparison">
        <div className="pricing-comparison-header">
          <h2>Compare All Features</h2>
          <p>See exactly what each plan includes.</p>
        </div>

        <div className="pricing-comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Starter</th>
                <th className="pricing-table-highlight">Professional</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Meetings per month</td>
                <td>10</td>
                <td className="pricing-table-highlight">100</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Smart scheduling</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Email notifications</td>
                <td>✓</td>
                <td className="pricing-table-highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>SMS notifications</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Advanced analytics</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Team collaboration</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-highlight">✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Custom integrations</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-disabled">✗</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Dedicated support</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-disabled">✗</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>SSO & enterprise security</td>
                <td className="pricing-table-disabled">✗</td>
                <td className="pricing-table-disabled">✗</td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pricing-faq">
        <div className="pricing-faq-header">
          <span className="pricing-faq-badge">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p>Have questions? We've got answers.</p>
        </div>

        <div className="pricing-faq-grid">
          <div className="pricing-faq-item">
            <h3>Can I cancel my subscription anytime?</h3>
            <p>Yes, you can cancel your subscription at any time. No questions asked.</p>
          </div>
          <div className="pricing-faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
          </div>
          <div className="pricing-faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, we offer a 14-day free trial on all paid plans. No credit card required.</p>
          </div>
          <div className="pricing-faq-item">
            <h3>Can I switch plans later?</h3>
            <p>Absolutely. You can upgrade or downgrade your plan at any time.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pricing-cta">
        <div className="pricing-cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied users and transform your scheduling today.</p>
          <div className="pricing-cta-actions">
            <Link to="/signup" className="pricing-btn primary large">
              Start Free Trial <FaArrowRight />
            </Link>
            <Link to="/contact" className="pricing-btn outline">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
}