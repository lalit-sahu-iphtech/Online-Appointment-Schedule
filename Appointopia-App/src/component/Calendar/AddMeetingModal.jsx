// src/component/Calendar/AddMeetingModal.jsx
import { useState, useEffect } from "react";
import {
    FaTimes,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPlus,
    FaLink,
    FaVideo,
    FaSync,
    FaSpinner,
} from "react-icons/fa";
import "./AddMeetingModal.css";
import { useNavigate } from "react-router-dom";
import AddInviteeModal from "./AddInviteeModal";
import { useToast } from "../Toast";
import { createMeetingLink } from "../../utils/meetingLinkGenerator";

const AVATAR_COLORS = [
    '#8755D5', '#16A6AD', '#FF7800', '#2F80D7', 
    '#E84C8A', '#27AE60', '#F2C94C', '#4A56E2'
];

export default function AddMeetingModal({ onClose, onSave, defaultDate, initialData, isEditMode }) {
    const toast = useToast();

    const getDefaultDate = () => {
        if (initialData?.date) return initialData.date;
        if (defaultDate && typeof defaultDate === 'string') return defaultDate;
        return new Date().toISOString().split('T')[0];
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
    const [errors, setErrors] = useState({});
    const [showInviteeModal, setShowInviteeModal] = useState(false);
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!initialData && defaultDate && typeof defaultDate === 'string') {
            setFormData(prev => ({ ...prev, date: defaultDate }));
        }
    }, [defaultDate, initialData]);

    useEffect(() => {
        setFormData(buildFormData());
        setErrors({});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    /**
     * ✅ Generate Google Meet Link - Redirects to CREATE page
     */
    const handleGenerateMeetLink = () => {
        if (!formData.meetingName.trim()) {
            toast.warning('Meeting Name Required', 'Please enter a meeting name first.');
            return;
        }

        setIsGeneratingLink(true);

        try {
            const meetingLink = createMeetingLink(
                formData.meetingName,
                formData.date || new Date().toISOString().split('T')[0],
                formData.startTime || "10:00"
            );

            setFormData(prev => ({
                ...prev,
                onlineLink: meetingLink.fullLink
            }));

            toast.success(
                'Meet Link Generated!',
                'Click the link to create your Google Meet session.'
            );

        } catch (error) {
            console.error('Error generating meet link:', error);
            toast.error('Generation Failed', 'Could not generate meeting link. Please try again.');
        } finally {
            setIsGeneratingLink(false);
        }
    };

    /**
     * ✅ Open Google Meet in new tab
     */
    const handleJoinMeeting = () => {
        if (!formData.onlineLink) {
            toast.warning('No Link', 'Please generate or enter a meeting link first.');
            return;
        }

        window.open(formData.onlineLink, '_blank');
        toast.info('Creating Meeting', 'Google Meet will open to create your meeting.');
    };

    const addInvitee = ({ name, email }) => {
        if (formData.invitees.some(item => item.email.toLowerCase() === email.toLowerCase())) {
            toast.warning('Already Invited', `${name} is already invited.`);
            return;
        }

        const newInvitee = {
            id: Date.now(),
            name,
            email,
            avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            initials: name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
        };

        setFormData(prev => ({ ...prev, invitees: [...prev.invitees, newInvitee] }));
        toast.success('Invitee Added', `${name} has been added.`);
    };

    const removeInvitee = (id) => {
        const invitee = formData.invitees.find(item => item.id === id);
        setFormData({ ...formData, invitees: formData.invitees.filter(item => item.id !== id) });
        if (invitee) {
            toast.info('Removed', `${invitee.name} has been removed.`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.meetingName.trim()) newErrors.meetingName = "Meeting name is required";
        if (!formData.date) newErrors.date = "Date is required";
        if (!formData.startTime || !formData.endTime) newErrors.time = "Start and end time are required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.warning('Validation Error', 'Please fill in all required fields.');
            return;
        }

        if (formData.startTime >= formData.endTime) {
            toast.error('Invalid Time', 'End time must be after start time.');
            return;
        }

        onSave(formData);
        onClose();
        
        if (isEditMode) {
            toast.success('Meeting Updated', `"${formData.meetingName}" has been updated.`);
        } else {
            toast.success('Meeting Created', `"${formData.meetingName}" has been scheduled.`);
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleAdvancedSettings = () => {
        onClose();
        navigate("/settings");
        toast.info('Settings', 'Opening advanced settings...');
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
                        {/* MEETING NAME */}
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

                        {/* DATE + TIME */}
                        <div className="form-row">
                            <div className="form-group">
                                <label>Date <span className="required-star">*</span></label>
                                <div className="input-icon">
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        min={getTodayDate()}
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
                                    </div>
                                    <span className="time-separator">-</span>
                                    <div className="time-input-group">
                                        <input
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                        />
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
                                <div className="input-with-actions">
                                    <div className="input-icon">
                                        <input
                                            type="text"
                                            name="onlineLink"
                                            value={formData.onlineLink}
                                            onChange={handleChange}
                                            placeholder="https://meet.google.com/..."
                                            className={errors.onlineLink ? 'input-error' : ''}
                                        />
                                        <FaLink />
                                    </div>
                                    <div className="link-actions">
                                        <button
                                            type="button"
                                            className="generate-meet-btn"
                                            onClick={handleGenerateMeetLink}
                                            disabled={isGeneratingLink}
                                        >
                                            {isGeneratingLink ? (
                                                <FaSpinner className="spinner-icon" />
                                            ) : (
                                                <>
                                                    <FaVideo />
                                                    Generate Meet
                                                </>
                                            )}
                                        </button>
                                        {formData.onlineLink && (
                                            <button
                                                type="button"
                                                className="test-meet-btn"
                                                onClick={handleJoinMeeting}
                                                title="Create Google Meet session"
                                            >
                                                <FaSync />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {formData.onlineLink && (
                                    <div className="link-preview">
                                        <span className="link-preview-text">
                                            🔗 Create meeting: {formData.onlineLink}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INVITEES */}
                        <div className="invitees-section">
                            <label>Invitees</label>
                            <div className="invitee-list">
                                {formData.invitees.map((person) => (
                                    <div className="invitee-chip-with-avatar" key={person.id}>
                                        <div 
                                            className="invitee-avatar"
                                            style={{ backgroundColor: person.avatarColor }}
                                        >
                                            {person.initials}
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
                                    <button type="button" onClick={() => setShowInviteeModal(true)}>
                                        <FaPlus /> Add Invitee
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* QUICK TIMES */}
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
                                        toast.info('Quick Time Set', `Duration set to ${duration}.`);
                                    }}
                                >
                                    {duration}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="meeting-modal-footer">
                        <button 
                            type="button" 
                            className="advanced-btn"
                            onClick={handleAdvancedSettings}
                        >
                            Advanced settings
                        </button>
                        <button type="submit" className="save-meeting-btn">
                            {isEditMode ? "Update Meeting" : "Save Meeting"}
                        </button>
                    </div>
                </form>
            </div>

            {showInviteeModal && (
                <AddInviteeModal
                    onClose={() => setShowInviteeModal(false)}
                    onAdd={addInvitee}
                />
            )}
        </div>
    );
}