import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import google from "../../assets/images/google.png";
import facebook from "../../assets/images/facebook.png";
import logo from "../../assets/images/logo.png";

import "./auth.css";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    // Email validation
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    // Get users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const user = users.find(
      (user) => user.email === trimmedEmail
    );

    // User doesn't exist
    if (!user) {
      setError("Account not found. Please sign up first.");
      return;
    }

    // Save current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(user)
    );

    setSuccessMessage("Login successful!");

    setEmail("");

    // Go to home
    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <div className="auth-page">

      {/* Logo */}
      <div className="auth-logo">
        
        <Link to="/"className="logo-link">
        <div className="auth-logo-icon">
          <img
            src={logo}
            alt="Appointopia"
          />
        </div>

        <h2>Appointopia</h2>
        </Link>

       

      </div>


      {/* Shapes */}
      <div className="auth-top-right-shape"></div>
      <div className="auth-bottom-left-shape"></div>


      {/* Left Section */}
      <div className="auth-left">

        <div className="auth-card">

          <h1>Welcome Back</h1>

          <p className="auth-description">
            Sign in to your Appointopia account
          </p>


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <label>
              Enter your email
            </label>

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

            {error && (
              <span className="error-message">
                {error}
              </span>
            )}

            {successMessage && (
              <p className="success-message">
                {successMessage}
              </p>
            )}


            {/* Sign In */}
            <button
              type="submit"
              className="auth-main-btn"
            >
              Sign In
            </button>


            {/* OR */}
            <div className="auth-or-divider">
              <span>OR</span>
            </div>


            {/* Google */}
            <button
              type="button"
              className="auth-social-btn auth-google-btn"
            >
              <img
                src={google}
                alt="Google"
              />

              <span>
                Sign in with Google
              </span>

            </button>


            {/* Facebook */}
            <button
              type="button"
              className="auth-social-btn auth-facebook-btn"
            >
              <img
                src={facebook}
                alt="Facebook"
              />

              <span>
                Sign in with Facebook
              </span>

            </button>

          </form>


          {/* Sign Up */}
          <p className="auth-bottom-text">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="auth-link"
            >
              Sign up
            </Link>

          </p>

        </div>

      </div>


      {/* Right Section */}
      <div className="auth-right">

        <div className="auth-quote">

          <span className="auth-quote-mark">
            “
          </span>

          <p>
            Welcome back to{" "}
            <span className="auth-highlight">
              effortlessly
            </span>{" "}
            organize your schedule, manage events,
            and stay on top of your busy life.
          </p>

          <span className="auth-quote-mark">
            ”
          </span>

        </div>

      </div>

    </div>
  );
}