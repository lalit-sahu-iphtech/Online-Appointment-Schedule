// src/component/AuthPage/SignUp.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../services/authService";

import logo from "../../assets/images/logo.png";

import "./auth.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Reset errors and messages
    setErrors({});
    setSuccessMessage("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await signUp(
        formData.email.trim().toLowerCase(),
        formData.password,
        formData.name.trim()
      );

      const userData = {
        uid: user.uid,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      window.dispatchEvent(new Event("userLoggedIn"));

      setSuccessMessage("Account created successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Sign up error:", error);
      
      // ✅ Clear previous errors and set new error
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "❌ This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "❌ Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "❌ Password is too weak. Use at least 6 characters with uppercase, lowercase and number.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "❌ Too many attempts. Please try again later.";
      } else if (error.message) {
        errorMessage = `❌ ${error.message}`;
      }
      
      // ✅ Set error and ensure it shows in UI
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ✅ Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
          <h1>Create Account</h1>
          <p className="auth-description">
            Join Appointopia to manage your schedule effortlessly
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                disabled={loading}
              />
              {/* ✅ Email error message - clearly visible */}
              {errors.email && <span className="error-message" style={{ 
                display: "block", 
                marginTop: "4px",
                color: "#e53935",
                fontSize: "12px",
                fontWeight: "500"
              }}>{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "input-error" : ""}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {successMessage && <p className="success-message">{successMessage}</p>}

            <button type="submit" className="auth-main-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
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