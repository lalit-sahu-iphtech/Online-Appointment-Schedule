import {
    FaRegClock,
    FaRegCalendarCheck,
    FaSlidersH,
    FaLink,
    FaShareAlt,
    FaTrash
  } from "react-icons/fa";
  
  export default function AppointmentCard({ appointment, onDelete }) {
    
    const handleShare = async () => {
      const shareData = {
        title: appointment.title,
        text: `Join my appointment: ${appointment.title}`,
        url: `https://${appointment.bookingPage}`
      };
      
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          // User cancelled
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`https://${appointment.bookingPage}`);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
    };
  
    const handleDelete = () => {
      if (window.confirm(`Delete "${appointment.title}"?`)) {
        onDelete(appointment.id);
      }
    };
  
    return (
      <div className={`appointment-card ${appointment.color}`}>
        <div className="appointment-card-content">
          <div className="appointment-title-row">
            <h3>{appointment.title}</h3>

            <div style={{ display: "flex", gap: "8px" }}>
              <button 
                className="card-setting" 
                onClick={handleDelete}
                style={{ color: "#ef4444" }}
              >
                <FaTrash size={12} />
              </button>
              <button className="card-setting">
                <FaSlidersH />
              </button>
            </div>
          </div>
          {appointment.location && (
                    <div style={{ fontSize: '12px', color: '#4e5662', marginTop: '6px' }}>
                        📍 {appointment.location}
                    </div>
                )}
  
          <div className="appointment-info">
            <span>
              <FaRegClock />
              {appointment.duration}
            </span>
            <span>
              <FaRegCalendarCheck />
              {appointment.bookings}
            </span>
          </div>
  
          <div className="booking-page">
            <span>Booking page</span>
            <span className="external-arrow">↗</span>
          </div>
  
          <div className="appointment-divider"></div>
  
          <div className="appointment-bottom">
            <a href={`https://${appointment.bookingPage}`} target="_blank" rel="noreferrer">
              <FaLink />
              {appointment.bookingPage.split("/")[0]}
            </a>
            <button className="share-button" onClick={handleShare}>
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>
    );
  }