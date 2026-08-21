// src/component/Calendar/AddMeetingModal.jsx
import { useState, useEffect } from "react";
import {
    FaTimes,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPlus,
    FaLink,
    FaClock,
    FaUserCircle,
} from "react-icons/fa";
import "./AddMeetingModal.css";
import { useNavigate } from "react-router-dom";

const AVATAR_COLORS = [
    '#8755D5', '#16A6AD', '#FF7800', '#2F80D7', 
    '#E84C8A', '#27AE60', '#F2C94C', '#4A56E2'
];

export default function AddMeetingModal({ onClose, onSave, defaultDate, initialData, isEditMode }) {

    const getDefaultDate = () => {
        if (initialData?.date) return initialData.date;
        if (defaultDate && typeof defaultDate === 'string') return defaultDate;
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const buildFormData = () => ({
        meetingName: initialData?.meetingName || "",
        date: getDefaultDate(),
        startTime: initialData?.startTime || "09:00",
        endTime: initialData?.endTime || "10:00",
        location: initialData?.location || "",
        onlineLink: initialData?.onlineLink || "",
        invitees: initialData?.invitees ? [...initialData.invitees] : []
    });

    const [formData, setFormData] = useState(buildFormData);
    const [inviteeName, setInviteeName] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        if (!initialData && defaultDate && typeof defaultDate === 'string') {
            setFormData(prev => ({ ...prev, date: defaultDate }));
        }
    }, [defaultDate, initialData]);

    useEffect(() => {
        setFormData(buildFormData());
        setErrors({});
        setInviteeName("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const addInvitee = () => {
        if (!inviteeName.trim()) {
            alert("Please enter a name");
            return;
        }
        if (formData.invitees.some(item => item.name === inviteeName.trim())) {
            alert("This person is already invited");
            return;
        }

        const newInvitee = {
            id: Date.now(),
            name: inviteeName.trim(),
            email: `${inviteeName.trim().toLowerCase().replace(/\s/g, '.')}@example.com`,
            avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            initials: inviteeName.trim().split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
        };

        setFormData({ ...formData, invitees: [...formData.invitees, newInvitee] });
        setInviteeName("");
    };

    const removeInvitee = (id) => {
        setFormData({ ...formData, invitees: formData.invitees.filter(item => item.id !== id) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.meetingName.trim()) newErrors.meetingName = "Meeting name is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.startTime || !formData.endTime) newErrors.time = "Start and end time are required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (formData.startTime >= formData.endTime) {
            alert("End time must be after start time");
            return;
        }

        onSave(formData);
        onClose();
    };

    const handleInviteeKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addInvitee();
        }
    };

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const getColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
    };

    // ✅ Format time for display - only used for AM/PM label
    const getTimeAmPm = (time) => {
        if (!time) return "AM";
        const [h] = time.split(':').map(Number);
        return h >= 12 ? 'PM' : 'AM';
    };

    return (
        <div className="meeting-overlay" onClick={onClose}>
            <div className="meeting-modal" onClick={(e) => e.stopPropagation()}>
                <div className="meeting-modal-header">
                    <h2>{isEditMode ? "Edit Meeting" : "Add New Meeting"}</h2>
                    <button className="meeting-close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="meeting-form-body">
                        {/* Meeting Name */}
                        <div className="form-group full-width">
                            <label>Meeting Name <span className="required-star">*</span></label>
                            <input
                                type="text"
                                name="meetingName"
                                value={formData.meetingName}
                                onChange={handleChange}
                                placeholder="Enter meeting name"
                                className={errors.meetingName ? 'input-error' : ''}
                            />
                            {errors.meetingName && <span className="error-text">{errors.meetingName}</span>}
                        </div>

                        {/* DATE + TIME - FIXED */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date <span className="required-star">*</span></label>
                                <div className="input-icon">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                    />
                                    <FaCalendarAlt className="calendar-icon" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Time <span className="required-star">*</span></label>
                                <div className="time-inputs-wrapper">
                                    <div className="time-input-group">
                                        <input
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                        />
                                        {/* <span className="time-ampm">{getTimeAmPm(formData.startTime)}</span> */}
                                    </div>
                                    <span className="time-separator">-</span>
                                    <div className="time-input-group">
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                        />
                                        {/* <span className="time-ampm">{getTimeAmPm(formData.endTime)}</span> */}
                                    </div>
                                </div>
                                {errors.time && <span className="error-text">{errors.time}</span>}
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

                        {/* INVITEES WITH AVATAR */}
                        <div className="invitees-section">
                            <label>Invitees</label>
                            <div className="invitee-list">
                                {formData.invitees.map((person) => (
                                    <div className="invitee-chip-with-avatar" key={person.id}>
                                        <div 
                                            className="invitee-avatar"
                                            style={{ backgroundColor: person.avatarColor || getColorFromName(person.name) }}
                                        >
                                            {person.initials || getInitials(person.name)}
                                        </div>
                                        <span className="invitee-name">{person.name}</span>
                                        <button
                                            type="button"
                                            className="invitee-remove"
                                            onClick={() => removeInvitee(person.id)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}

                                <div className="add-invitee">
                                    <input
                                        type="text"
                                        value={inviteeName}
                                        onChange={(e) => setInviteeName(e.target.value)}
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
                        <div className="quick-times">
                            <span className="quick-times-label">Quick:</span>
                            {['30 min', '1 hour', '2 hours'].map((duration) => (
                                <button
                                    key={duration}
                                    type="button"
                                    className="quick-time-btn"
                                    onClick={() => {
                                        const start = formData.startTime;
                                        const [h, m] = start.split(':').map(Number);
                                        let endH = h, endM = m;
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

                    <div className="meeting-modal-footer">
                        <button type="button" className="advanced-btn"
                        onClick={()=>{
                            onClose();
                            navigate("/settings");
                        }}
                        >
                            ⚙️ Advanced settings
                        </button>
                        <button type="submit" className="save-meeting-btn">
                            {isEditMode ? "✅ Update Meeting" : "✅ Save Meeting"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}