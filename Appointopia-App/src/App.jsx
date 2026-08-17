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