import { Routes, Route } from "react-router-dom";

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
import Calendar from "./component/Calendar/Calendar";
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
  return (
    <Routes>

      {/* Landing Page */}

      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Hero/>
            <br /><br /><br />
            <Statistics/>
            <Scheduling/>
            <GetStarted/>
            <FAQ/>
            <WhatsNew/>

           

            <Footer/>
           
          </>
        }
      />

      <Route path="/calendar"element={ <CalendarPage/>}/>
      <Route path="/appointment-schedule"element={ <AppointmentSchedulePage/>}/>
      <Route path="/workflows"element={ <WorkflowsPage/>}/>

      <Route path="/profile"element={<Profile/>}/>
      <Route path="/settings"element={<Setting/>}/>

      <Route path="/product" element={<ProductPage />} />
        <Route path="/resource" element={<ResourcePage />} />
        <Route path="/company" element={<CompanyPage />} />
        <Route path="/pricing" element={<PricingPage />} />



      {/* Sign Up */}

      <Route
        path="/signup"
        element={<SignUp />}
      />


      {/* Sign In */}

      <Route
        path="/signin"
        element={<SignIn />}
      />

    </Routes>
  );
}

export default App;