import "./navbar.css";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="navbar">
      
      {/* Logo */}
      <div className="nav-left">
        {/* <div className="logo-icon">▦</div> */}
        <h1>Appointopia</h1>
      </div>

      {/* Navigation */}
      <div className="nav-mid">
        <ul>
          <li><a href="#product">Product</a></li>
          <li><a href="#resource">Resource</a></li>
          <li><a href="#company">Company</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
      </div>

      {/* Auth Buttons */}
      <div className="nav-right">
        <Link to="/signin"className="sign-in-btn">Sign in</Link>
        <Link to="/signup"className="sign-up-btn">Sign up</Link>
      </div>

    </nav>
  );
}