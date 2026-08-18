// src/component/Sidebar/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { BiGitBranch } from "react-icons/bi";

import logo from "../../assets/images/logo.png";
import happyPerson from "../../assets/images/calendar.png";

import "./sidebar.css";

const menuItems = [
  { path: "/calendar", label: "Calendar", icon: FaCalendarAlt },
  { path: "/appointment-schedule", label: "Appointment Schedule", icon: MdEventNote },
  { path: "/workflows", label: "Workflows", icon: BiGitBranch },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Link to="/" className="sidebar-link">
          <div className="logo-icon">
            <img src={logo} alt="Appointopia" />
            <span>Appointopia</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname.startsWith(path);
          return (
            <Link to={path} key={path} className="sidebar-link">
              <div className={isActive ? "sidebar-item-active" : "sidebar-item"}>
                <Icon className="sidebar-icon" />
                <span>{label}</span>
              </div>
            </Link>
          );
        })}
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