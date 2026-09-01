import { useNavigate } from "react-router-dom";
import {
  FaRegCalendarCheck,
  FaRegBuilding,
  FaRegClock,
} from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { PiBuildingApartment } from "react-icons/pi";
import { LuClock4 } from "react-icons/lu";
import "./statistics.css";

export default function Statistics() {
  const navigate = useNavigate();

  const statistics = [
    {
      id: 1,
      icon: <FaRegCircleUser />,
      number: "1+M",
      title: "New Users",
      className: "users-card",
      route: "/signup",
      description: "Join our growing community of satisfied users"
    },
    {
      id: 2,
      icon: <FaRegCalendarCheck />,
      number: "2+M",
      title: "Meeting Schedule",
      className: "meeting-card-st",
      route: "/calendar",
      description: "Efficiently manage your meetings and appointments"
    },
    {
      id: 3,
      icon: <PiBuildingApartment />,
      number: "200+",
      title: "Trusted businesses",
      className: "business-card",
      route: "/company",
      description: "Leading companies trust Appointopia for scheduling"
    },
    {
      id: 4,
      icon: <LuClock4 />,
      number: "40%",
      title: "Save Time",
      className: "time-card",
      route: "/features",
      description: "Optimize your workflow and save valuable time"
    },
  ];

  const handleCardClick = (stat) => {
    console.log(`Statistics card clicked: ${stat.title}`);
    console.log(` Navigating to: ${stat.route}`);
    console.log(` ${stat.description}`);
    
    // Navigate to the route
    navigate(stat.route);
  };

  return (
    <section className="statistics">
      <div className="statistics-container">
        {statistics.map((item) => (
          <div
            className={`stat-card ${item.className}`}
            key={item.id}
            onClick={() => handleCardClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(item);
              }
            }}
            title={item.description}
          >
            <div className="stat-icon">
              {item.icon}
            </div>
            <h2>{item.number}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}