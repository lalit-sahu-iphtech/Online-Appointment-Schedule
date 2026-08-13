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

    // Email validation
    if (!trimmedEmail) {
      setError("Email is required");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      setError("Enter a valid email address");
      return;
    }

    // Get existing users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Check if email already exists
    const userExists = users.some(
      (user) => user.email === trimmedEmail
    );

    if (userExists) {
      setError("Account already exists with this email");
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: trimmedEmail,
    };

    // Save user
    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    // Save current user
    localStorage.setItem(
      "currentUser",
      JSON.stringify(newUser)
    );

    setSuccessMessage("Account created successfully!");

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
        <div className="auth-logo-icon">
          <img src={logo} alt="Appointopia" />
        </div>

        <h2>Appointopia</h2>
      </div>

      {/* Shapes */}
      <div className="auth-top-right-shape"></div>
      <div className="auth-bottom-left-shape"></div>

      {/* Left Section */}
      <div className="auth-left">

        <div className="auth-card">

          <h1>Welcome</h1>

          <p className="auth-description">
            Create an account on Appointopia for free
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {/* Email */}
            <label>
              Enter your email to get started
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

            {/* Sign Up */}
            <button
              type="submit"
              className="auth-main-btn"
            >
              Sign Up
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
              <img src={google} alt="Google" />
              <span>Sign up with Google</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              className="auth-social-btn auth-facebook-btn"
            >
              <img src={facebook} alt="Facebook" />
              <span>Sign up with Facebook</span>
            </button>

          </form>

          {/* Sign In */}
          <p className="auth-bottom-text">
            Already have an account?{" "}

            <Link
              to="/signin"
              className="auth-link"
            >
              Sign in
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
            Join us to{" "}
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