// src/component/CreateAppointment/CreateAppointment.jsx
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
import { useToast } from "../Toast";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MONTH_LABELS = [
  "JAN", "FEB", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUG", "SEP", "OCT", "NOV", "DEC",
];

export default function CreateAppointment({ onClose, onSave }) {
  const toast = useToast();

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

  // Copy link handler with toast
  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Copied!', 'Link copied to clipboard successfully.');
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error('Copy Failed', 'Unable to copy link. Please try again.');
    }
  };

  /* =========================================
     STEP 2 — SCHEDULE
  ========================================= */

  const [scheduleData, setScheduleData] = useState({
    selectMode: "days", // "days" | "weeks" | "months"
    daysCount: "7",
    duration: "60 mins",
    timezone: "Eastern Time Zone (ET) - UTC-5",
    targetMonth: MONTH_LABELS[new Date().getMonth()],
  });

  // ✅ FIXED: Default time 09:00 AM - 05:00 PM
  const [availability, setAvailability] = useState({
    MON: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    TUE: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    WED: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    THU: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    FRI: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
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

  // Add a new time slot
  const addSlot = (day) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        enabled: true,
        slots: [
          ...prev[day].slots,
          { start: "09:00", end: "17:00" },
        ],
      },
    }));
    toast.info('Slot Added', `New time slot added for ${day}`);
  };

  // Remove a time slot
  const removeSlot = (day, index) => {
    setAvailability((prev) => {
      const nextSlots = prev[day].slots.filter(
        (_, i) => i !== index
      );
      const isEnabled = nextSlots.length > 0;
      return {
        ...prev,
        [day]: {
          enabled: isEnabled,
          slots: nextSlots,
        },
      };
    });
    toast.info('Slot Removed', `Time slot removed for ${day}`);
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
     HELPER FUNCTIONS
  ========================================= */

  // Convert 12-hour to 24-hour format
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "09:00";
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr)) {
      return timeStr;
    }
    return "09:00";
  };

  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get day index (MON=0, TUE=1, ..., SUN=6)
  const getDayIndex = (date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1;
  };

  // Get day name from index
  const getDayName = (index) => {
    return DAYS[index] || "MON";
  };

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  /* =========================================
     NAVIGATION
  ========================================= */

  const handleNext = () => {
    if (!formData.eventName.trim()) {
      toast.warning('Missing Event Name', 'Please enter an event name.');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.warning('Missing Location', 'Please enter a location.');
      return;
    }
    
    setStep(2);
    toast.info('Step 2', 'Now configure your schedule settings.');
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleReview = () => {
    const hasAvailability = Object.values(availability).some(day => day.enabled && day.slots.length > 0);
    
    if (!hasAvailability) {
      toast.error('No Availability', 'Please add at least one available time slot.');
      return;
    }
    
    setStep(3);
    toast.info('Review', 'Please review your appointment details before sharing.');
  };

  const handleEdit = () => {
    setStep(1);
  };

  // handleShare with automatic scheduling
  const handleShare = async () => {
    if (!formData.eventName.trim()) {
      toast.warning('Missing Event Name', 'Please enter an event name.');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.warning('Missing Location', 'Please enter a location.');
      return;
    }
    
    const hasAvailability = Object.values(availability).some(day => day.enabled && day.slots.length > 0);
    if (!hasAvailability) {
      toast.error('No Availability', 'Please add at least one available time slot.');
      return;
    }

    const loadingToast = toast.loading('Creating Appointments...', 'Please wait');

    try {
      const userStr = localStorage.getItem("currentUser");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user) {
        loadingToast.error('Not Logged In', 'Please sign in to create appointments.');
        return;
      }

      let daysToCreate = 0;
      const startDate = new Date();

      if (scheduleData.selectMode === "days") {
        daysToCreate = parseInt(scheduleData.daysCount) || 7;
      } else if (scheduleData.selectMode === "weeks") {
        daysToCreate = (parseInt(scheduleData.daysCount) || 1) * 7;
      } else if (scheduleData.selectMode === "months") {
        daysToCreate = (parseInt(scheduleData.daysCount) || 1) * 30;
      }

      if (daysToCreate > 365) {
        loadingToast.error('Too Many Days', 'Please select 365 days or less.');
        return;
      }

      const availableSlots = {};
      DAYS.forEach((day, index) => {
        if (availability[day]?.enabled && availability[day].slots.length > 0) {
          availableSlots[index] = availability[day].slots;
        }
      });

      if (Object.keys(availableSlots).length === 0) {
        loadingToast.error('No Availability', 'Please add at least one available time slot.');
        return;
      }

      const baseAppointment = {
        title: formData.eventName,
        location: formData.location,
        onlineLink: formData.onlineLink,
        duration: scheduleData.duration,
        bookings: 0,
        color: selectedColor,
        organizerEmail: user?.email || "unknown",
        organizerName: user?.email?.split('@')[0] || "User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        description: formData.description,
        maxInvitees: formData.maxInvitees,
      };

      const appointments = [];
      let currentDate = new Date(startDate);
      let dayCounter = 1;

      for (let i = 0; i < daysToCreate; i++) {
        const dayIndex = getDayIndex(currentDate);
        const slots = availableSlots[dayIndex] || [];

        if (slots.length > 0) {
          const slot = slots[0];
          const startTime24 = convertTo24Hour(slot.start);
          const endTime24 = convertTo24Hour(slot.end);
          const dateStr = formatDate(currentDate);
          
          const daySuffix = dayCounter > 1 ? ` - Day ${dayCounter}` : '';
          
          const appointment = {
            ...baseAppointment,
            title: `${formData.eventName}${daySuffix}`,
            date: dateStr,
            startTime: startTime24,
            endTime: endTime24,
            bookingPage: `${formData.onlineLink.replace(/^https?:\/\//, "")}/${slugify(formData.eventName)}${daySuffix ? `-day-${dayCounter}` : ''}`,
            targetMonth: scheduleData.targetMonth,
            dayOfWeek: getDayName(dayIndex),
          };
          
          appointments.push(appointment);
          dayCounter++;
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (appointments.length === 0) {
        loadingToast.error('No Appointments', 'No appointments could be created for the selected days.');
        return;
      }

      let savedCount = 0;
      for (const appointment of appointments) {
        await onSave(appointment, scheduleData.targetMonth);
        savedCount++;
      }

      loadingToast.success(
        'Appointments Created!',
        `${savedCount} appointment${savedCount > 1 ? 's' : ''} have been scheduled successfully.`
      );

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error('Error creating appointments:', error);
      loadingToast.error(
        'Creation Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    }
  };

  const selectedColorHex = colors.find(
    (c) => c.id === selectedColor
  )?.color;

  return (
    <div className="create-appointment-overlay">

      <aside className="create-appointment-drawer">

        {/* HEADER */}
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
            onClick={() => {
              if (step !== 3 && (formData.eventName !== "One-on-one" || formData.location !== "Room 01")) {
                if (window.confirm('Are you sure you want to close? Your changes will not be saved.')) {
                  onClose();
                  toast.info('Cancelled', 'Appointment creation cancelled.');
                }
              } else {
                onClose();
              }
            }}
            aria-label="Close"
          >
            <FaTimes />
          </button>

        </div>

        {/* BODY */}
        <div className="create-drawer-body">

          {step === 1 ? (

            /* STEP 1 — GENERAL INFORMATION */
            <div className="general-information">

              <div className="general-title">
                <FaInfoCircle />
                <h3>General information</h3>
              </div>

              {/* EVENT NAME */}
              <div className="gi-field gi-full-field">
                <label htmlFor="eventName">
                  Event Name <span className="required-star">*</span>
                </label>
                <input
                  id="eventName"
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleChange}
                  placeholder="Enter event name"
                  required
                />
              </div>

              {/* LOCATION + ONLINE LINK */}
              <div className="gi-row">
                <div className="gi-field">
                  <label htmlFor="location">
                    Location <span className="required-star">*</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                      required
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
                      placeholder="Enter online link"
                    />
                    <FaRegCopy
                      className="copy-link-icon"
                      onClick={() => handleCopyLink(formData.onlineLink)}
                      style={{ cursor: 'pointer' }}
                      title="Copy link"
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
                  <label>Event Color</label>
                  <div className="color-options">
                    {colors.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`color-option ${
                          selectedColor === item.id ? "selected" : ""
                        }`}
                        style={{ backgroundColor: item.color }}
                        onClick={() => {
                          setSelectedColor(item.id);
                          toast.info('Color Changed', `Event color set to ${item.id}`);
                        }}
                        aria-label={`${item.id} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="gi-field description-field">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxHeight={100}
                  placeholder="Enter event description"
                />
              </div>

            </div>

          ) : step === 2 ? (

            /* STEP 2 — SCHEDULE */
            <div className="schedule-step">

              {/* APPOINTMENT SUMMARY CHIP */}
              <div
                className="appointment-summary-chip"
                style={{ borderColor: colors.find(c => c.id === selectedColor)?.color }}
              >
                <span className="summary-label">Appointment</span>
                <div className="summary-value">
                  <FaCheckCircle
                    style={{
                      color: colors.find((c) => c.id === selectedColor)?.color,
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
                <label className="section-label">Invitees can select</label>

                <div className="invitees-option-row">
                  <button
                    type="button"
                    className={`radio-dot ${scheduleData.selectMode === "days" ? "checked" : ""}`}
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
                    <select
                      value={scheduleData.selectMode === "days" ? "Days" : scheduleData.selectMode === "weeks" ? "Weeks" : "Months"}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        setScheduleData((prev) => ({
                          ...prev,
                          selectMode: value,
                        }));
                      }}
                    >
                      <option value="Days">Days</option>
                      <option value="Weeks">Weeks</option>
                      <option value="Months">Months</option>
                    </select>
                    <FaChevronDown />
                  </div>
                  
                  <span className="into-future-text">Into the future</span>
                </div>

                <div className="invitees-option-row">
                  <button
                    type="button"
                    className={`radio-dot ${scheduleData.selectMode === "range" ? "checked" : ""}`}
                    onClick={() =>
                      setScheduleData((prev) => ({
                        ...prev,
                        selectMode: "range",
                      }))
                    }
                    aria-label="Select within a date range"
                  />
                  <span className="into-future-text">Within a date range</span>
                </div>
              </div>

              {/* DURATION + TIMEZONE */}
              <div className="schedule-duration-row">
                <div className="schedule-field">
                  <label>Duration <span className="required-star">*</span></label>
                  <div className="select-with-icon">
                    <select
                      name="duration"
                      value={scheduleData.duration}
                      onChange={handleScheduleChange}
                    >
                      <option value="30 mins">30 mins</option>
                      <option value="60 mins">60 mins</option>
                      <option value="90 mins">90 mins</option>
                    </select>
                    <FaChevronDown />
                  </div>
                </div>

                <div className="schedule-field">
                  <label>Timezone</label>
                  <div className="select-with-icon">
                    <select
                      name="timezone"
                      value={scheduleData.timezone}
                      onChange={handleScheduleChange}
                    >
                      <option>Eastern Time Zone (ET) - UTC-5</option>
                      <option>Central Time Zone (CT) - UTC-6</option>
                      <option>Pacific Time Zone (PT) - UTC-8</option>
                    </select>
                    <FaChevronDown />
                  </div>
                </div>
              </div>

              {/* ADD TO MONTH */}
              <div className="schedule-field target-month-field">
                <label>Add to Month <span className="required-star">*</span></label>
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

              {/* ✅ GENERAL AVAILABILITY - FIXED */}
              <div className="availability-field">
                <label className="section-label">
                  General availability <span className="required-star">*</span>
                </label>

                {DAYS.map((day) => {
                  const dayData = availability[day];

                  return (
                    <div className="availability-row" key={day}>
                      <span className="day-label">{day}</span>

                      {dayData.enabled ? (
                        <div className="slots-column">
                          {dayData.slots.map((slot, index) => (
                            <div className="slot-row" key={index}>
                              {/* START TIME */}
                              <div className="time-input-wrap">
                                <input
                                  type="time"
                                  value={slot.start}
                                  onChange={(e) =>
                                    updateSlot(day, index, "start", e.target.value)
                                  }
                                  id={`start-${day}-${index}`}
                                />
                                <FaClock
                                  className="time-icon"
                                  onClick={() => {
                                    const input = document.getElementById(`start-${day}-${index}`);
                                    if (input) {
                                      input.showPicker?.();
                                      input.focus();
                                    }
                                  }}
                                />
                              </div>

                              <FaArrowRight className="slot-arrow" />

                              {/* END TIME */}
                              <div className="time-input-wrap">
                                <input
                                  type="time"
                                  value={slot.end}
                                  onChange={(e) =>
                                    updateSlot(day, index, "end", e.target.value)
                                  }
                                  id={`end-${day}-${index}`}
                                />
                                <FaClock
                                  className="time-icon"
                                  onClick={() => {
                                    const input = document.getElementById(`end-${day}-${index}`);
                                    if (input) {
                                      input.showPicker?.();
                                      input.focus();
                                    }
                                  }}
                                />
                              </div>

                              {/* REMOVE BUTTON */}
                              <button
                                type="button"
                                className="remove-slot-btn"
                                onClick={() => removeSlot(day, index)}
                                aria-label={`Remove slot for ${day}`}
                              >
                                <FaTimes />
                              </button>

                              {/* ADD BUTTON */}
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
                          <span className="unavailable-text">Unavailable</span>
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

              {/* ADD WORKFLOW */}
              <button
                type="button"
                className="add-workflow-box"
                onClick={() => {
                  toast.info('Workflow', 'Add Workflow feature coming soon!');
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

            /* STEP 3 — REVIEW INFORMATION */
            <div className="review-step">
              {/* ... review section code ... */}
            </div>

          )}

        </div>

        {/* FOOTER */}
        <div className="create-drawer-footer">

          {step === 2 && (
            <button className="back-button" onClick={handleBack}>
              <FaArrowLeft />
              <span>Back</span>
            </button>
          )}

          {step === 3 && (
            <button className="back-button" onClick={handleEdit}>
              <FaPen />
              <span>Edit</span>
            </button>
          )}

          {step === 1 && (
            <button className="next-button" onClick={handleNext}>
              <span>Next</span>
              <FaArrowRight />
            </button>
          )}

          {step === 2 && (
            <button className="next-button" onClick={handleReview}>
              <span>Next</span>
              <FaChevronRight />
            </button>
          )}

          {step === 3 && (
            <button className="next-button" onClick={handleShare}>
              <span>Share</span>
              <FaArrowRight />
            </button>
          )}

        </div>

      </aside>

    </div>
  );
}