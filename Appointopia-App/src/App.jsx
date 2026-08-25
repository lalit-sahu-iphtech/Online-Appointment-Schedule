// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChange } from "./services/authService";

import Navbar from "./component/Navbar/Navbar";
import SignUp from "./component/AuthPage/SignUp";
import SignIn from "./component/AuthPage/SignIn";
import Hero from "./component/Hero/Hero";
import Footer from "./component/Footer/Footer";
import Statistics from "./component/Statistics/Statistics";
import Scheduling from "./component/Scheduling/Scheduling";
import GetStarted from "./component/GetStarted/GetStarted";
import FAQ from "./component/Faq/Faq";
import WhatsNew from "./component/WhatsNew/WhatsNew";
import CalendarPage from "./pages/CalendarPage/CalendarPage";
import AppointmentSchedulePage from "./pages/AppointmentSchedulePage/AppointmentSchedulePage";
import WorkflowsPage from "./pages/WorkflowsPage/WorkflowsPage";
import Profile from "./pages/Profile/Profile";
import Setting from "./pages/Setting/Setting";
import ProductPage from "./pages/ProductPage/ProductPage";
import ResourcePage from "./pages/ResourcePage/ResourcePage";
import CompanyPage from "./pages/CompanyPage/CompanyPage";
import PricingPage from "./pages/PricingPage/PricingPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (userData) => {
      if (userData) {
        setUser(userData);
        // Store in localStorage for components that need it
        localStorage.setItem("currentUser", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("currentUser");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Show loading while checking auth
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Poppins, sans-serif",
          color: "#8555d5",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero />
            <br />
            <br />
            <br />
            <Statistics />
            <Scheduling />
            <GetStarted />
            <FAQ />
            <WhatsNew />
            <Footer />
          </>
        }
      />

      {/* Main App Pages */}
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/appointment-schedule" element={<AppointmentSchedulePage />} />
      <Route path="/workflows" element={<WorkflowsPage />} />

      {/* User Pages */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Setting />} />

      {/* Static Pages */}
      <Route path="/product" element={<ProductPage />} />
      <Route path="/resource" element={<ResourcePage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* Auth Pages */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

export default App;