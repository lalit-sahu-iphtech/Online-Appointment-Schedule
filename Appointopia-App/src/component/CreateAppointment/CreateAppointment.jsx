import { useState } from "react";

import {
  FaTimes,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaRegCopy,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaPlusCircle,
  FaPen,
  FaLink,
  FaUsers,
  FaAlignLeft,
  FaRegClock,
  FaPalette,
} from "react-icons/fa";

import "./createAppointment.css";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Matches the exact labels used in appointmentData.js (Jan -> Dec)
const MONTH_LABELS = [
  "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export default function CreateAppointment({ onClose, onSave }) {

  const [step, setStep] = useState(1);
  const [copyToast, setCopyToast] = useState(false); 

  /* =========================================
     STEP 1 — GENERAL INFORMATION
  ========================================= */

  const [formData, setFormData] = useState({
    eventName: "One-on-one",
    location: "Room 01",
    onlineLink: "Link.com",
    maxInvitees: "1",
    description:
      '"One-on-One" is an innovative and exclusive networking event designed to facilitate meaningful connections and foster professional growth within a diverse community of industry experts, professionals, and enthusiasts',
  });

  const [selectedColor, setSelectedColor] = useState("teal");

  const colors = [
    { id: "purple", color: "#8755D5" },
    { id: "teal", color: "#16A6AD" },
    { id: "orange", color: "#FF7800" },
    { id: "blue", color: "#2F80D7" },
    { id: "yellow", color: "#FFD600" },
  ];

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // ✅ Copy link handler with toast
  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };


  /* =========================================
     STEP 2 — SCHEDULE
  ========================================= */

  const [scheduleData, setScheduleData] = useState({
    selectMode: "days", // "days" | "range"
    daysCount: "7",
    duration: "60 mins",
    timezone: "Eastern Time Zone (ET) - UTC-5",
    targetMonth: MONTH_LABELS[new Date().getMonth()],
  });

  const [availability, setAvailability] = useState({
    MON: { enabled: true, slots: [{ start: "01:00 PM", end: "05:00 PM" }] },
    TUE: { enabled: true, slots: [{ start: "01:00 PM", end: "05:00 PM" }] },
    WED: { enabled: true, slots: [{ start: "01:00 PM", end: "05:00 PM" }] },
    THU: { enabled: true, slots: [{ start: "01:00 PM", end: "05:00 PM" }] },
    FRI: { enabled: true, slots: [{ start: "01:00 PM", end: "05:00 PM" }] },
    SAT: { enabled: false, slots: [] },
    SUN: { enabled: false, slots: [] },
  });

  const handleScheduleChange = (e) => {

    const { name, value } = e.target;

    setScheduleData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  // Add a new time slot to a day (also enables the day if it was off)
  const addSlot = (day) => {

    setAvailability((prev) => ({
      ...prev,
      [day]: {
        enabled: true,
        slots: [
          ...prev[day].slots,
          { start: "01:00 PM", end: "05:00 PM" },
        ],
      },
    }));

  };

  // Remove a time slot; if it was the last one, mark the day unavailable
  const removeSlot = (day, index) => {

    setAvailability((prev) => {

      const nextSlots = prev[day].slots.filter(
        (_, i) => i !== index
      );

      return {
        ...prev,
        [day]: {
          enabled: nextSlots.length > 0,
          slots: nextSlots,
        },
      };

    });

  };

  // Update start/end value of a specific slot
  const updateSlot = (day, index, field, value) => {

    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    }));

  };

  /* =========================================
     NAVIGATION
  ========================================= */

  const handleNext = () => {

    console.log("Appointment Data:", {
      ...formData,
      color: selectedColor,
    });

    setStep(2);

  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReview = () => {
    setStep(3);
  };

  const handleEdit = () => {
    setStep(1);
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

      const handleShare = () => {
        // ✅ Get current time for start time
        const now = new Date();
        const startHour = now.getHours() + 1;
        const startMin = now.getMinutes();
        const startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
        
        // ✅ Parse duration
        const durationMatch = scheduleData.duration?.match(/(\d+)/);
        const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;
        
        // ✅ Calculate end time
        const endTotalMinutes = (startHour * 60 + startMin) + durationMinutes;
        const endHour = Math.floor(endTotalMinutes / 60);
        const endMin = endTotalMinutes % 60;
        const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
      
        // ✅ Get LOCAL date (not UTC)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const localDateStr = `${year}-${month}-${day}`;
      
        // Build the appointment object
        const newAppointment = {
          id: Date.now(),
          title: formData.eventName,
          location: formData.location,
          onlineLink: formData.onlineLink,
          duration: scheduleData.duration,
          bookings: "0 bookings",
          bookingPage: `${formData.onlineLink.replace(/^https?:\/\//, "")}/${slugify(formData.eventName)}`,
          color: selectedColor,
          startTime: startTime,
          endTime: endTime,
          date: localDateStr // ✅ Use LOCAL date
        };
      
        // Call onSave with the new appointment and target month
        if (onSave) {
          onSave(newAppointment, scheduleData.targetMonth);
        }
      
        // Close the modal
        onClose();
      };

  const selectedColorHex = colors.find(
    (c) => c.id === selectedColor
  )?.color;

  return (
    <div className="create-appointment-overlay">

      {/* =================================
          RIGHT DRAWER
      ================================= */}

      <aside className="create-appointment-drawer">

        {/* =================================
            HEADER
        ================================= */}

        <div className="create-drawer-header">

          {step === 3 ? (
            <h2 style={{ color: selectedColorHex }}>
              {formData.eventName}
            </h2>
          ) : (
            <h2>Create appointment</h2>
          )}

          <button
            className="create-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>

        </div>


        {/* =================================
            BODY
        ================================= */}

        <div className="create-drawer-body">

          {step === 1 ? (

            /* =========================================
               STEP 1 — GENERAL INFORMATION
            ========================================= */

            <div className="general-information">

              <div className="general-title">

                <FaInfoCircle />

                <h3>General information</h3>

              </div>


              {/* EVENT NAME */}

              <div className="gi-field gi-full-field">

                <label htmlFor="eventName">
                  Event Name
                </label>

                <input
                  id="eventName"
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                />

              </div>


              {/* LOCATION + ONLINE LINK */}

              <div className="gi-row">

                <div className="gi-field">

                  <label htmlFor="location">
                    Location
                  </label>

                  <div className="input-with-icon">

                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />

                    <FaMapMarkerAlt />

                  </div>

                </div>

                <div className="gi-field">

                  <label htmlFor="onlineLink">
                    Online Event Link
                  </label>

                  <div className="input-with-icon">

                    <input
                      id="onlineLink"
                      type="text"
                      name="onlineLink"
                      value={formData.onlineLink}
                      onChange={handleChange}
                    />

                    <FaRegCopy
                      className="copy-link-icon"
                      onClick={() => handleCopyLink(formData.onlineLink)} // ✅ Updated
                    />

                  </div>

                </div>

              </div>


              {/* MAX INVITEES + COLOR */}

              <div className="gi-row">

                <div className="gi-field">

                  <label htmlFor="maxInvitees">
                    Max invitees
                  </label>

                  <input
                    id="maxInvitees"
                    type="number"
                    min="1"
                    name="maxInvitees"
                    value={formData.maxInvitees}
                    onChange={handleChange}
                  />

                </div>

                <div className="gi-field event-color-field">

                  <label>
                    Event Color
                  </label>

                  <div className="color-options">

                    {colors.map((item) => (

                      <button
                        key={item.id}
                        type="button"
                        className={`color-option ${
                          selectedColor === item.id
                            ? "selected"
                            : ""
                        }`}
                        style={{
                          backgroundColor: item.color,
                        }}
                        onClick={() =>
                          setSelectedColor(item.id)
                        }
                        aria-label={`${item.id} color`}
                      />

                    ))}

                  </div>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="gi-field description-field">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxHeight={100}
                />

              </div>

            </div>

          ) : step === 2 ? (

            /* =========================================
               STEP 2 — SCHEDULE
            ========================================= */

            <div className="schedule-step">

              {/* APPOINTMENT SUMMARY CHIP */}

              <div
                className="appointment-summary-chip"
                style={{ borderColor: colors.find(c => c.id === selectedColor)?.color }}
              >

                <span className="summary-label">
                  Appointment
                </span>

                <div className="summary-value">

                  <FaCheckCircle
                    style={{
                      color: colors.find(
                        (c) => c.id === selectedColor
                      )?.color,
                    }}
                  />

                  <strong>{formData.eventName}</strong>

                </div>

              </div>


              {/* SCHEDULE TITLE */}

              <div className="schedule-section-title">

                <FaCalendarAlt />

                <h3>Schedule</h3>

              </div>


              {/* INVITEES CAN SELECT */}

              <div className="invitees-select-field">

                <label className="section-label">
                  Invitees can select
                </label>

                <div className="invitees-option-row">

                  <button
                    type="button"
                    className={`radio-dot ${
                      scheduleData.selectMode === "days"
                        ? "checked"
                        : ""
                    }`}
                    onClick={() =>
                      setScheduleData((prev) => ({
                        ...prev,
                        selectMode: "days",
                      }))
                    }
                    aria-label="Select days into the future"
                  />

                  <input
                    type="text"
                    name="daysCount"
                    className="days-count-input"
                    value={scheduleData.daysCount}
                    onChange={handleScheduleChange}
                    disabled={scheduleData.selectMode !== "days"}
                  />

                  <div className="select-with-icon unit-select">

                    <select defaultValue="Days">
                      <option>Days</option>
                      <option>Weeks</option>
                      <option>Months</option>
                    </select>

                    <FaChevronDown />

                  </div>

                  <span className="into-future-text">
                    Into the future
                  </span>

                </div>

                <div className="invitees-option-row">

                  <button
                    type="button"
                    className={`radio-dot ${
                      scheduleData.selectMode === "range"
                        ? "checked"
                        : ""
                    }`}
                    onClick={() =>
                      setScheduleData((prev) => ({
                        ...prev,
                        selectMode: "range",
                      }))
                    }
                    aria-label="Select within a date range"
                  />

                  <span className="into-future-text">
                    Within a date range
                  </span>

                </div>

              </div>


              {/* DURATION + TIMEZONE */}

              <div className="schedule-duration-row">

                <div className="schedule-field">

                  <label>
                    Duration
                  </label>

                  <div className="select-with-icon">

                    <select
                      name="duration"
                      value={scheduleData.duration}
                      onChange={handleScheduleChange}
                    >
                      <option>30 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                    </select>

                    <FaChevronDown />

                  </div>

                </div>

                <div className="schedule-field">

                  <label>
                    Timezone
                  </label>

                  <div className="select-with-icon">

                    <select
                      name="timezone"
                      value={scheduleData.timezone}
                      onChange={handleScheduleChange}
                    >
                      <option>
                        Eastern Time Zone (ET) - UTC-5
                      </option>
                      <option>
                        Central Time Zone (CT) - UTC-6
                      </option>
                      <option>
                        Pacific Time Zone (PT) - UTC-8
                      </option>
                    </select>

                    <FaChevronDown />

                  </div>

                </div>

              </div>


              {/* ADD TO MONTH */}

              <div className="schedule-field target-month-field">

                <label>
                  Add to Month
                </label>

                <div className="select-with-icon">

                  <select
                    name="targetMonth"
                    value={scheduleData.targetMonth}
                    onChange={handleScheduleChange}
                  >
                    {MONTH_LABELS.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <FaChevronDown />

                </div>

              </div>


              {/* GENERAL AVAILABILITY */}

              <div className="availability-field">

                <label className="section-label">
                  General availability
                </label>

                {DAYS.map((day) => {

                  const dayData = availability[day];

                  return (

                    <div className="availability-row" key={day}>

                      <span className="day-label">
                        {day}
                      </span>

                      {dayData.enabled ? (

                        <div className="slots-column">

                          {dayData.slots.map((slot, index) => (

                            <div
                              className="slot-row"
                              key={index}
                            >

                              <div className="time-input-wrap">

                                <input
                                  type="text"
                                  value={slot.start}
                                  onChange={(e) =>
                                    updateSlot(
                                      day,
                                      index,
                                      "start",
                                      e.target.value
                                    )
                                  }
                                />

                                <FaClock />

                              </div>

                              <FaArrowRight className="slot-arrow" />

                              <div className="time-input-wrap">

                                <input
                                  type="text"
                                  value={slot.end}
                                  onChange={(e) =>
                                    updateSlot(
                                      day,
                                      index,
                                      "end",
                                      e.target.value
                                    )
                                  }
                                />

                                <FaClock />

                              </div>

                              <button
                                type="button"
                                className="remove-slot-btn"
                                onClick={() =>
                                  removeSlot(day, index)
                                }
                                aria-label={`Remove slot for ${day}`}
                              >
                                <FaTimes />
                              </button>

                              {index === dayData.slots.length - 1 && (

                                <button
                                  type="button"
                                  className="add-slot-btn"
                                  onClick={() => addSlot(day)}
                                  aria-label={`Add slot for ${day}`}
                                >
                                  <FaPlus />
                                </button>

                              )}

                            </div>

                          ))}

                        </div>

                      ) : (

                        <div className="unavailable-row">

                          <span className="unavailable-text">
                            Unavailable
                          </span>

                          <button
                            type="button"
                            className="add-slot-btn"
                            onClick={() => addSlot(day)}
                            aria-label={`Add slot for ${day}`}
                          >
                            <FaPlus />
                          </button>

                        </div>

                      )}

                    </div>

                  );

                })}

              </div>


              {/* ✅ ADD WORKFLOW - CLICKABLE */}

              <button
                type="button"
                className="add-workflow-box"
                onClick={() => {
                  console.log("Add Workflow clicked!");
                  // TODO: Open workflow modal or navigate
                  alert("Add Workflow feature coming soon!");
                }}
              >

                <div className="add-workflow-title">

                  <FaPlusCircle />

                  <span>Add Workflow</span>

                </div>

                <p>
                  Set up automations around your events, such
                  as thank you email, text notification, etc.
                </p>

              </button>

            </div>

          ) : (

            /* =========================================
               STEP 3 — REVIEW INFORMATION (Updated Design)
            ========================================= */

            <div className="review-step">

              {/* GENERAL INFORMATION RECAP */}

              <div className="review-section">

                <div className="review-title">

                  <FaInfoCircle />

                  <h3>General information</h3>

                </div>

                <div className="review-grid">

                  {/* Location */}
                  <div className="review-field">
                    <label>
                      <FaMapMarkerAlt />
                      Location
                    </label>
                    <div className="review-value">
                      {formData.location}
                    </div>
                  </div>

                  {/* Online Link */}
                  <div className="review-field">
                    <label>
                      <FaLink />
                      Online Link
                    </label>
                    <div className="review-link-wrapper">
                      <span className="review-value review-link">
                        {formData.onlineLink}
                      </span>
                      <button
                        className="review-copy-btn"
                        onClick={() => handleCopyLink(formData.onlineLink)}
                        aria-label="Copy link"
                        type="button"
                      >
                        <FaRegCopy />
                      </button>
                    </div>
                  </div>

                  {/* Max Invitees */}
                  <div className="review-field">
                    <label>
                      <FaUsers />
                      Max invitees
                    </label>
                    <div className="review-value">
                      {formData.maxInvitees}
                    </div>
                  </div>

                  {/* Event Color */}
                  <div className="review-field">
                    <label>
                      <FaPalette />
                      Event Color
                    </label>
                    <div
                      className="review-color-dot"
                      style={{ backgroundColor: selectedColorHex }}
                    />
                  </div>

                </div>

                {/* Description - Full Width */}
                <div className="review-field review-full-field">

                  <label>
                    <FaAlignLeft />
                    Description
                  </label>

                  <p className="review-value review-description">
                    {formData.description}
                  </p>

                </div>

              </div>


              {/* SCHEDULE RECAP */}

              <div className="review-section">

                <div className="review-title">

                  <FaCalendarAlt />

                  <h3>Schedule</h3>

                </div>

                {/* Invitees can select */}
                <div className="review-field review-full-field">

                  <label className="ap-invitee">
                    <FaUsers />
                    Invitees can select
                  </label>

                  <div className="review-value">
                    {scheduleData.selectMode === "days"
                      ? `${scheduleData.daysCount} days into the future`
                      : "Within a date range"}
                  </div>

                </div>

                {/* General Availability */}
                <div className="review-field review-full-field">

                  <label>
                    <FaRegClock />
                    General availability
                  </label>

                  <div className="availability-review-list">

                    {DAYS.map((day) => {

                      const dayData = availability[day];
                      const isAvailable = dayData.enabled && dayData.slots.length > 0;

                      return (

                        <div
                          className={`availability-review-row ${isAvailable ? "has-slot" : ""}`}
                          key={day}
                        >

                          <span className="review-day-label">
                            {day}
                          </span>

                          {isAvailable ? (

                            <div className="review-slots">

                              {dayData.slots.map((slot, index) => (

                                <span
                                  className="review-slot-time"
                                  key={index}
                                >
                                  <span className="review-slot-start">{slot.start}</span>
                                  <FaArrowRight className="review-slot-arrow" />
                                  <span className="review-slot-end">{slot.end}</span>
                                </span>

                              ))}

                            </div>

                          ) : (

                            <span className="review-unavailable">
                              Unavailable
                            </span>

                          )}

                        </div>

                      );

                    })}

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>


        {/* =================================
            FOOTER
        ================================= */}

        <div className="create-drawer-footer">

          {step === 2 && (

            <button
              className="back-button"
              onClick={handleBack}
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>

          )}

          {step === 3 && (

            <button
              className="back-button"
              onClick={handleEdit}
            >
              <FaPen />
              <span>Edit</span>
            </button>

          )}

          {step === 1 && (

            <button
              className="next-button"
              onClick={handleNext}
            >
              <span>Next</span>
              <FaArrowRight />
            </button>

          )}

          {step === 2 && (

            <button
              className="next-button"
              onClick={handleReview}
            >
              <span>Next</span>
              <FaChevronRight />
            </button>

          )}

          {step === 3 && (

            <button
              className="next-button"
              onClick={handleShare}
            >
              <span>Share</span>
              <FaArrowRight />
            </button>

          )}

        </div>

      </aside>

      {/* ✅ COPY TOAST */}
      {copyToast && (
        <div className="copy-toast">
          Link copied to clipboard! ✓
        </div>
      )}

    </div>
  );
}