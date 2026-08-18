import { useState, useEffect } from "react";
import {
    FaTimes,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPlus,
    FaLink,
    FaClock
} from "react-icons/fa";
import "./AddMeetingModal.css";

export default function AddMeetingModal({ onClose, onSave, defaultDate }) {

    // Agar defaultDate string hai toh use karo, nahi toh today's date
    const getDefaultDate = () => {
        if (defaultDate && typeof defaultDate === 'string') {
            return defaultDate;
        }
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        meetingName: "",
        date: getDefaultDate(),
        startTime: "09:00",
        endTime: "10:00",
        location: "",
        onlineLink: "",
        invitees: []
    });

    const [invitee, setInvitee] = useState("");
    const [errors, setErrors] = useState({});

    // Jab defaultDate change ho toh form update ho
    useEffect(() => {
        if (defaultDate && typeof defaultDate === 'string') {
            setFormData(prev => ({
                ...prev,
                date: defaultDate
            }));
        }
    }, [defaultDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const addInvitee = () => {
        if (!invitee.trim()) {
            alert("Please enter a name");
            return;
        }

        // Check duplicate
        if (formData.invitees.includes(invitee.trim())) {
            alert("This person is already invited");
            return;
        }

        setFormData({
            ...formData,
            invitees: [...formData.invitees, invitee.trim()]
        });
        setInvitee("");
    };

    const removeInvitee = (index) => {
        setFormData({
            ...formData,
            invitees: formData.invitees.filter((_, i) => i !== index)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {};
        if (!formData.meetingName.trim()) {
            newErrors.meetingName = "Meeting name is required";
        }
        if (!formData.date) {
            newErrors.date = "Date is required";
        }
        if (!formData.startTime || !formData.endTime) {
            newErrors.time = "Start and end time are required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Check if end time is after start time
        if (formData.startTime >= formData.endTime) {
            alert("End time must be after start time");
            return;
        }

        onSave(formData);
        onClose();
    };

    // Handle Enter key in invitee input
    const handleInviteeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addInvitee();
        }
    };

    return (
        <div className="meeting-overlay" onClick={onClose}>
            <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>

                {/* HEADER */}
                <div className="meeting-modal-header">
                    <h2>Add New Meeting</h2>
                    <button className="meeting-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit}>
                    <div className="meeting-form-body">

                        {/* Meeting Name */}
                        <div className="form-group full-width">
                            <label>Meeting Name <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="text"
                                name="meetingName"
                                value={formData.meetingName}
                                onChange={handleChange}
                                placeholder="Enter meeting name"
                                className={errors.meetingName ? 'input-error' : ''}
                            />
                            {errors.meetingName && (
                                <span className="error-text">{errors.meetingName}</span>
                            )}
                        </div>

                        {/* DATE + TIME */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date <span style={{ color: 'red' }}>*</span></label>
                                <div className="input-icon">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                    <FaCalendarAlt />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Time <span style={{ color: 'red' }}>*</span></label>
                                <div className="time-inputs">
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                    />
                                    <span>-</span>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.time && (
                                    <span className="error-text">{errors.time}</span>
                                )}
                            </div>
                        </div>

                        {/* LOCATION + ONLINE LINK */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Location</label>
                                <div className="input-icon">
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Room 01"
                                    />
                                    <FaMapMarkerAlt />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Online Link</label>
                                <div className="input-icon">
                                    <input
                                        type="text"
                                        name="onlineLink"
                                        value={formData.onlineLink}
                                        onChange={handleChange}
                                        placeholder="https://meet.com/..."
                                    />
                                    <FaLink />
                                </div>
                            </div>
                        </div>

                        {/* INVITEES */}
                        <div className="invitees-section">
                            <label>Invitees</label>
                            <div className="invitee-list">
                                {formData.invitees.map((person, index) => (
                                    <div className="invitee-chip" key={index}>
                                        <span>{person}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeInvitee(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                <div className="add-invitee">
                                    <input
                                        type="text"
                                        value={invitee}
                                        onChange={(e) => setInvitee(e.target.value)}
                                        onKeyPress={handleInviteeKeyPress}
                                        placeholder="Add invitee"
                                    />
                                    <button type="button" onClick={addInvitee}>
                                        <FaPlus /> Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Quick time suggestions */}
                        <div className="quick-times" style={{ marginTop: '12px' }}>
                            <span style={{ fontSize: '11px', color: '#667085', marginRight: '8px' }}>
                                Quick:
                            </span>
                            {['30 min', '1 hour', '2 hours'].map((duration) => (
                                <button
                                    key={duration}
                                    type="button"
                                    className="quick-time-btn"
                                    onClick={() => {
                                        const start = formData.startTime;
                                        const [h, m] = start.split(':').map(Number);
                                        let endH = h;
                                        let endM = m;
                                        if (duration === '30 min') endM += 30;
                                        else if (duration === '1 hour') endH += 1;
                                        else if (duration === '2 hours') endH += 2;
                                        
                                        if (endM >= 60) {
                                            endH += Math.floor(endM / 60);
                                            endM = endM % 60;
                                        }
                                        const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
                                        setFormData({ ...formData, endTime });
                                    }}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* FOOTER */}
                    <div className="meeting-modal-footer">
                        <button type="button" className="advanced-btn">
                            ⚙️ Advanced settings
                        </button>
                        <button type="submit" className="save-meeting-btn">
                            ✅ Save Meeting
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}