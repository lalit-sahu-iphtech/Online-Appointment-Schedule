import { Routes, Route } from "react-router-dom";

import Navbar from "./component/Navbar/Navbar";
import SignUp from "./component/AuthPage/SignUp";
import SignIn from "./component/AuthPage/SignIn";
import Hero from "./component/Hero/Hero";
import Footer from "./component/Footer/Footer";

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

            <Footer/>
           
          </>
        }
      />


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