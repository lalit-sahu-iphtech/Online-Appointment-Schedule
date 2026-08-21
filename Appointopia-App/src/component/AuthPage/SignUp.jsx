import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import google from "../../assets/images/google.png";
import facebook from "../../assets/images/facebook.png";
import logo from "../../assets/images/logo.png";

import "./auth.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === trimmedEmail);

    if (userExists) {
      setError("Account already exists with this email");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      email: trimmedEmail,
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    // ✅ Dispatch event so GetStarted updates
    window.dispatchEvent(new Event("userLoggedIn"));

    setSuccessMessage("Account created successfully!");
    setEmail("");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="auth-page">
      {/* Logo */}
      <div className="auth-logo">
        <Link to="/" className="logo-link">
          <div className="auth-logo-icon">
            <img src={logo} alt="Appointopia" />
          </div>
          <h2>Appointopia</h2>
        </Link>
      </div>

      <div className="auth-top-right-shape"></div>
      <div className="auth-bottom-left-shape"></div>

      <div className="auth-left">
        <div className="auth-card">
          <h1>Welcome</h1>
          <p className="auth-description">
            Create an account on Appointopia for free
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Enter your email to get started</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccessMessage("");
              }}
              className={error ? "input-error" : ""}
            />

            {error && <span className="error-message">{error}</span>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="auth-main-btn">
              Sign Up
            </button>

            <div className="auth-or-divider">
              <span>OR</span>
            </div>

            <button type="button" className="auth-social-btn auth-google-btn">
              <img src={google} alt="Google" />
              <span>Sign up with Google</span>
            </button>

            <button type="button" className="auth-social-btn auth-facebook-btn">
              <img src={facebook} alt="Facebook" />
              <span>Sign up with Facebook</span>
            </button>
          </form>

          <p className="auth-bottom-text">
            Already have an account?{" "}
            <Link to="/signin" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-quote">
          <span className="auth-quote-mark">“</span>
          <p>
            Join us to{" "}
            <span className="auth-highlight">effortlessly</span>{" "}
            organize your schedule, manage events,
            and stay on top of your busy life.
          </p>
          <span className="auth-quote-mark">”</span>
        </div>
      </div>
    </div>
  );
}