import { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLink,
  FaShareAlt,
  FaCheck,
  FaRegCommentDots,
} from "react-icons/fa";
import "./AddMeetingModal.css";

export default function EventDetailsModal({ event, onClose, onAddComment }) {
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");

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

  // Naya comment/note is meeting me add karo
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    if (onAddComment) {
      onAddComment(commentText.trim());
    }
    setCommentText("");
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatCommentTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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

          {/* Comments / Notes Section (har meeting ka apna section) */}
          <div className="comments-section" style={{ marginTop: "16px" }}>
            <label>
              <FaRegCommentDots /> Comments
            </label>

            <div className="comment-list">
              {event.comments && event.comments.length > 0 ? (
                event.comments.map((c) => (
                  <div className="comment-item" key={c.id}>
                    <span className="comment-text">{c.text}</span>
                    <span className="comment-time">{formatCommentTime(c.time)}</span>
                  </div>
                ))
              ) : (
                <div className="comment-empty">No comments yet</div>
              )}
            </div>

            <div className="comment-input-row">
              <input
                type="text"
                placeholder="Add a note or comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleCommentKeyPress}
              />
              <button type="button" onClick={handleAddComment}>
                Post
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