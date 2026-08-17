import { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLink,
  FaShareAlt,
  FaCheck,
} from "react-icons/fa";
import "./AddMeetingModal.css";

export default function EventDetailsModal({ event, onClose }) {
  const [copied, setCopied] = useState(false);

  // Agar koi event click nahi hua toh popup mat dikhao
  if (!event) return null;

  // Meeting link ya current URL
  const meetingLink = event.onlineLink || window.location.href;

  // Link copy karne ka function
  const handleShareLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2 second baad wapis normal button
  };

  return (
    <div className="meeting-overlay">
      <div className="meeting-modal">
        {/* Header */}
        <div className="meeting-modal-header">
          <h2>Meeting Details</h2>
          <button className="meeting-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Event Info */}
        <div className="meeting-form-body">
          <h3 style={{ margin: "0 0 14px 0", color: "#20242a" }}>
            {event.meetingName || "Meeting Details"}
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaCalendarAlt /> Date
              </label>

              <span style={{ fontSize: "12px", color: "#374151" }}>
                {event.date || "2023-07-10"}
              </span>
            </div>
            <div className="form-group">
              <label>
                <FaClock /> Time
              </label>

              <span style={{ fontSize: "12px", color: "#374151" }}>
                {event.startTime
                  ? `${event.startTime} - ${event.endTime}`
                  : "08:00 AM - 09:00 AM"}
              </span>
            </div>
          </div>

          {event.location && (
            <div
              className="form-group full-width"
              style={{ marginTop: "12px" }}
            >
              <label>
                <FaMapMarkerAlt /> Location
              </label>
              <span style={{ fontSize: "12px", color: "#374151" }}>
                {event.location}
              </span>
            </div>
          )}

          {/* Share Link Input */}
          <div className="form-group full-width" style={{ marginTop: "14px" }}>
            <label>
              <FaLink /> Share Meeting Link
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input type="text" readOnly value={meetingLink} />
              <button
                type="button"
                className="save-meeting-btn"
                onClick={handleShareLink}
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                {copied ? <FaCheck /> : <FaShareAlt />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="meeting-modal-footer"
          style={{ justifyContent: "flex-end" }}
        >
          <button type="button" className="save-meeting-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
