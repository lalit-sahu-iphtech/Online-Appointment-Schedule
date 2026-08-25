import { useState } from "react";
import {
    FaRegClock,
    FaRegCalendarCheck,
    FaSlidersH,
    FaLink,
    FaShareAlt,
    FaTrash,
    FaCheck,
    FaTimes
  } from "react-icons/fa";

  import "./AppointmentCard.css"
  
  export default function AppointmentCard({ appointment, onDelete, onUpdate }) {
    
    // ✅ Edit mode state
    const [isEditing, setIsEditing] = useState(false);
    
    // ✅ Edit form state
    const [editedTitle, setEditedTitle] = useState(appointment.title);
    const [editedLocation, setEditedLocation] = useState(appointment.location || "");
    const [editedDuration, setEditedDuration] = useState(appointment.duration);
    // const [editedStartTime, setEditedStartTime] = useState(appointment.startTime || "09:00");
    // const [editedEndTime, setEditedEndTime] = useState(appointment.endTime || "10:00");
    
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

    // ✅ Edit toggle function
    const handleEditToggle = () => {
      if (isEditing) {
        // Save changes
        onUpdate({
          ...appointment,
          title: editedTitle,
          location: editedLocation,
          duration: editedDuration,
          
        });
      }
      setIsEditing(!isEditing);
    };

    // ✅ Cancel edit
    const handleCancelEdit = () => {
      setEditedTitle(appointment.title);
      setEditedLocation(appointment.location || "");
      setEditedDuration(appointment.duration);
      
      setIsEditing(false);
    };
  
    return (
      <div className={`appointment-card ${appointment.color}`}>
        <div className="appointment-card-content">
          <div className="appointment-title-row">
            {isEditing ? (
              <input 
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="edit-input"
                placeholder="Appointment title"
                autoFocus
              />
            ) : (
              <h3>{appointment.title}</h3>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              {isEditing ? (
                // ✅ Edit mode mein Save/Cancel buttons
                <>
                  <button 
                    className="card-setting" 
                    onClick={handleEditToggle}
                    style={{ color: "#22c55e" }}
                    title="Save changes"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button 
                    className="card-setting" 
                    onClick={handleCancelEdit}
                    style={{ color: "#ef4444" }}
                    title="Cancel"
                  >
                    <FaTimes size={14} />
                  </button>
                </>
              ) : (
                // ✅ Normal mode mein Delete aur Edit icons
                <>
                  <button 
                    className="card-setting" 
                    onClick={handleDelete}
                    style={{ color: "#ef4444" }}
                  >
                    <FaTrash size={12} />
                  </button>
                  <button 
                    className="card-setting" 
                    onClick={handleEditToggle}
                    title="Edit appointment"
                  >
                    <FaSlidersH />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            // ✅ Edit mode - Location
            <input 
              type="text"
              value={editedLocation}
              onChange={(e) => setEditedLocation(e.target.value)}
              className="edit-input"
              placeholder="Location"
              style={{ marginTop: '6px' }}
            />
          ) : (
            appointment.location && (
              <div style={{ fontSize: '12px', color: '#4e5662', marginTop: '6px' }}>
                📍 {appointment.location}
              </div>
            )
          )}
  
          <div className="appointment-info">
            {isEditing ? (
              // ✅ Edit mode - Duration aur Time
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <input 
                  type="text"
                  value={editedDuration}
                  onChange={(e) => setEditedDuration(e.target.value)}
                  className="edit-input"
                  placeholder="Duration (e.g., 30 min)"
                />
                {/* <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="time"
                    value={editedStartTime}
                    onChange={(e) => setEditedStartTime(e.target.value)}
                    className="edit-input"
                    style={{ width: '50%' }}
                  />
                  <input 
                    type="time"
                    value={editedEndTime}
                    onChange={(e) => setEditedEndTime(e.target.value)}
                    className="edit-input"
                    style={{ width: '50%' }}
                  />
                </div> */}
              </div>
            ) : (
              // ✅ Normal mode
              <>
                <span>
                  <FaRegClock />
                  {appointment.duration}
                </span>
                <span>
                  <FaRegCalendarCheck />
                  {appointment.bookings || "0"}
                </span>
              </>
            )}
          </div>
  
          <div className="booking-page">
            <span>Booking page</span>
            <span className="external-arrow">↗</span>
          </div>
  
          <div className="appointment-divider"></div>
  
          <div className="appointment-bottom">
            <a href={`https://${appointment.bookingPage}`} target="_blank" rel="noreferrer">
              <FaLink />
              {appointment.bookingPage?.split("/")[0] || "booking"}
            </a>
            <button className="share-button" onClick={handleShare}>
              <FaShareAlt />
            </button>
          </div>
        </div>
      </div>
    );
  }