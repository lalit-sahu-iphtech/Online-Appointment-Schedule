

import "./hero.css"
import { FaRegHeart } from "react-icons/fa";

import profile1 from "../../assets/hero/A1.jpg";
import profile2 from "../../assets/hero/j1.jpg";
import profile3 from "../../assets/hero/B1.jpg";
import heroImg from "../../assets/hero/hero.png";
import dotImg from "../../assets/images/dotImg.png";



export default function Hero() {
  return (
    <section className="hero">

      {/* =========================
          PROFILE IMAGES
      ========================= */}

      <div className="hero-profile hero-profile-left">
        <img src={profile1} alt="profile" />
      </div>

      <div className="hero-profile hero-profile-right">
        <img src={profile2} alt="profile" />
      </div>

      <div className="hero-profile hero-profile-small">
        <img src={profile3} alt="profile" />
      </div>


      {/* =========================
          HERO CONTENT
      ========================= */}

      <div className="hero-content">

        <h1>
          Effortlessly organize
          <br />
          your <span>schedule</span>
        </h1>

        <p>
          Utilize digital calendars or scheduling apps to keep track of your
          appointments, deadlines, and events. These tools often offer
          reminders and can sync across multiple devices, ensuring you stay
          on top of your schedule
        </p>

        <button className="hero-btn">
          Get started
        </button>

      </div>


      {/* =========================
          HERO ILLUSTRATION
      ========================= */}

      <div className="hero-illustration">

        {/* Actual Dot Image */}
        <img
          src={dotImg}
          alt=""
          className="hero-dots"
        />


        {/* Heart */}
        <div className="hero-heart">
        <FaRegHeart />
        </div>


        {/* Main Illustration */}
        <img
          src={heroImg}
          alt="Schedule illustration"
          className="hero-main-image"
        />

      </div>

    </section>
  );
}