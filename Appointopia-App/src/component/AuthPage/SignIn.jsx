// src/component/AuthPage/SignIn.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../services/authService";

import logo from "../../assets/images/logo.png";
import "./auth.css";
import { useToast } from "../Toast";

export default function SignIn() {
  const navigate = useNavigate();
  const toast = useToast();
  console.log(' SignIn component mounted, toast:', toast);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setLoading(true);

    if (!validateForm()) {
      toast.warning("Validation Error", "Please fix the errors before continuing");
      setLoading(false);
      return;
    }

    try {
      const user = await signIn(
        formData.email.trim().toLowerCase(),
        formData.password
      );

      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || "User",
      };
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // ✅ Success toast
      toast.success(
        "👋 Welcome Back!",
        `Hello ${userData.name}! You have been signed in successfully.`
      );
      console.log('✅ Toast called successfully');
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      // ✅ Handle Firebase errors
      let errorMessage = "Something went wrong. Please try again.";
      let toastTitle = "❌ Sign In Failed";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email. Please sign up first.";
          toast.error(toastTitle, errorMessage);
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          toast.error(toastTitle, errorMessage);
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          toast.error(toastTitle, errorMessage);
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          toast.error(toastTitle, errorMessage);
          break;
        default:
          errorMessage = error.message || "Something went wrong. Please try again.";
          toast.error(toastTitle, errorMessage);
      }
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <h1>Welcome Back</h1>
          <p className="auth-description">
            Sign in to your Appointopia account
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
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

            <div className="forgot-password">
              <span>Forgot password?</span>
            </div>

            <button type="submit" className="auth-main-btn" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="auth-bottom-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-quote">
          <span className="auth-quote-mark">“</span>
          <p>
            Welcome back to{" "}
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