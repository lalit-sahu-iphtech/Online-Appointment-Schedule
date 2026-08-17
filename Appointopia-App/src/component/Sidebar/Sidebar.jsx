import { FaCalendarAlt } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";

import logo from "../../assets/images/logo.png";
import happyPerson from "../../assets/images/calendar.png";
import { Link } from "react-router-dom";

import "./sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
      <Link to="/" className="logo-link">
        <div className="logo-icon">
          <img src={logo} alt="Appointopia" />
          <span>Appointopia</span>
         
        </div>
        </Link>
       
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        <div className="sidebar-item sidebar-item-active">
          <FaCalendarAlt className="sidebar-icon" />
          <span>Calendar</span>
        </div>

        <div className="sidebar-item">
          <MdEventNote className="sidebar-icon" />
          <span>Appointment Schedule</span>
        </div>

        <div className="sidebar-item">
          <BiGitBranch className="sidebar-icon" />
          <span>Workflows</span>
        </div>

      </nav>

      {/* Happy Hour Card */}
      <div className="happy-hour-card">
        <h3>
          Happy Hour
          <br />
          is coming
        </h3>

        <div className="happy-person">
          <img src={happyPerson} alt="Happy hour" />
        </div>
      </div>

    </aside>
  );
}