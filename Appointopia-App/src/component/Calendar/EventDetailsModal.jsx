import {
  FaTimes,
  FaExpandAlt,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaLink,
  FaShareAlt,
  FaUserFriends,
  FaRegUserCircle,
  FaPen,
} from "react-icons/fa";
import "./eventDetailsModal.css";
import { useToast } from "../Toast";

export default function EventDetailsModal({ event, onClose, onExpand, onEdit, onShare }) {
  const toast = useToast();
  
  if (!event) return null;

  const meetingLink = event.onlineLink || window.location.href;

  const handleShare = () => {
    if (onShare) {
      onShare(event);
      return;
    }
    navigator.clipboard.writeText(meetingLink);
    toast.success('📋 Copied!', 'Meeting link copied to clipboard.');
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(event);
      toast.info('✏️ Editing', `Editing "${event.meetingName}"`);
    }
  };

  const formatTimeDisplay = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const getDurationLabel = () => {
    if (event.durationLabel) return event.durationLabel;
    if (!event.startTime || !event.endTime) return null;
    const [sh, sm] = event.startTime.split(":").map(Number);
    const [eh, em] = event.endTime.split(":").map(Number);
    const mins = (eh * 60 + em) - (sh * 60 + sm);
    if (mins <= 0) return null;
    if (mins < 60) return `${mins} mins`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return rem === 0 ? `${hrs} hr${hrs > 1 ? "s" : ""}` : `${hrs}h ${rem}m`;
  };

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "TUE, JUL 18";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d
      .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      .toUpperCase()
      .replace(",", ",");
  };

  const timeRange = event.startTime
    ? `${formatTimeDisplay(event.startTime)} - ${formatTimeDisplay(event.endTime)}`
    : "09:00 - 09:30 AM";

  const duration = getDurationLabel();

  return (
    <div className="event-details-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="event-details-header">
          <h2>{event.meetingName || "Meeting Details"}</h2>
          <div className="event-details-header-actions">
            {onExpand && (
              <button className="event-details-icon-btn" onClick={onExpand}>
                <FaExpandAlt />
              </button>
            )}
            <button className="event-details-icon-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="event-details-body">
          <div className="event-detail-columns">

            {/* Left column */}
            <div className="event-detail-col event-detail-col-left">
              <div className="event-detail-item">
                <div className="event-detail-label-row">
                  <FaCalendarAlt className="event-detail-icon" />
                  <span className="event-detail-label">Date</span>
                </div>
                <span className="event-detail-value">
                  {formatDateDisplay(event.date)}
                </span>
              </div>

              {event.location && (
                <div className="event-detail-item">
                  <div className="event-detail-label-row">
                    <FaMapMarkerAlt className="event-detail-icon" />
                    <span className="event-detail-label">Location</span>
                  </div>
                  <span className="event-detail-value">{event.location}</span>
                </div>
              )}

              <div className="event-detail-item">
                <div className="event-detail-label-row">
                  <FaClock className="event-detail-icon" />
                  <span className="event-detail-label">Time</span>
                  {duration && (
                    <span className="event-detail-duration-badge">{duration}</span>
                  )}
                </div>
                <span className="event-detail-value">{timeRange}</span>
              </div>

              {event.onlineLink && (
                <div className="event-detail-item">
                  <div className="event-detail-label-row">
                    <FaLink className="event-detail-icon" />
                    <span className="event-detail-label">Online Link</span>
                  </div>
                  <a
                    href={event.onlineLink}
                    target="_blank"
                    rel="noreferrer"
                    className="event-detail-link"
                  >
                    {event.onlineLink.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="event-detail-col">
              {event.organizer && (
                <div className="event-detail-item">
                  <div className="event-detail-label-row">
                    <FaRegUserCircle className="event-detail-icon" />
                    <span className="event-detail-label">Organizer</span>
                  </div>
                  <span className="event-detail-value">
                    {event.organizer.name || event.organizer}
                  </span>
                </div>
              )}

              {event.invitees && event.invitees.length > 0 && (
                <div className="event-detail-item">
                  <div className="event-detail-label-row">
                    <FaUserFriends className="event-detail-icon" />
                    <span className="event-detail-label">Invitees</span>
                  </div>
                  <div className="invitees-list-detail">
                    {event.invitees.map((person, index) => {
                      const name = person.name || person;
                      const color = person.avatarColor || "#8555D5";
                      const avatarUrl = person.avatarUrl;
                      const initials =
                        person.initials ||
                        name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

                      return (
                        <div key={index} className="invitee-chip-detail">
                          <div
                            className="invitee-avatar-detail"
                            style={{ backgroundColor: color }}
                          >
                            {avatarUrl ? <img src={avatarUrl} alt={name} /> : initials}
                          </div>
                          <span className="invitee-name-detail">{name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="event-details-footer">
          <button type="button" className="event-details-edit-btn" onClick={handleEdit}>
            <FaPen /> Edit
          </button>
          <button type="button" className="event-details-share-btn" onClick={handleShare}>
            Share <FaShareAlt />
          </button>
        </div>

      </div>
    </div>
  );
}