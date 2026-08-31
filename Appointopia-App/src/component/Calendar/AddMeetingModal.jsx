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
import emailjs from "@emailjs/browser";
import AddInviteeModal from "./AddInviteeModal";
import { useToast } from "../Toast";

// Import workflow executor
import { executeMatchingWorkflows } from "../../services/workflowExecutor";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const AVATAR_COLORS = [
    '#8755D5', '#16A6AD', '#FF7800', '#2F80D7', 
    '#E84C8A', '#27AE60', '#F2C94C', '#4A56E2'
];

export default function AddMeetingModal({ onClose, onSave, defaultDate, initialData, isEditMode }) {
    const toast = useToast();

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
    const [errors, setErrors] = useState({});
    const [showInviteeModal, setShowInviteeModal] = useState(false);
    const [isSending, setIsSending] = useState(false);

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

    const sendInviteEmails = async (data) => {
        if (!data.invitees || data.invitees.length === 0) return;
    
        setIsSending(true);
        const failed = [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    
        for (const person of data.invitees) {
            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    {
                        to_name: person.name,
                        to_email: person.email,
                        meeting_name: data.meetingName,
                        meeting_date: data.date,
                        start_time: data.startTime,
                        end_time: data.endTime,
                        meeting_location: data.location || "N/A",
                        online_link: data.onlineLink || "N/A",
                        organizer_name: currentUser?.email?.split('@')[0] || "Organizer",
                        organizer_email: currentUser?.email || "organizer@example.com",
                        custom_message: "Looking forward to seeing you!"
                    },
                    EMAILJS_PUBLIC_KEY
                );
            } catch (err) {
                console.error(`Failed to send invite to ${person.email}:`, err);
                failed.push(person.name);
            }
        }
    
        setIsSending(false);
    
        if (failed.length > 0) {
            toast.error('Email Failed', `Could not send to: ${failed.join(", ")}`);
        } else if (data.invitees.length > 0) {
            toast.success('Invitations Sent', `Sent to ${data.invitees.length} people!`);
        }
    };

    //  UPDATED: handleSubmit with workflow execution
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

        //  Get current user
        const userStr = localStorage.getItem("currentUser");
        const user = userStr ? JSON.parse(userStr) : null;

        // Prepare meeting data for workflows
        const meetingData = {
            meetingName: formData.meetingName,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location || "Online",
            onlineLink: formData.onlineLink || "",
            invitees: formData.invitees || [],
            organizerEmail: user?.email || "unknown",
            organizerName: user?.email?.split('@')[0] || "User",
            description: formData.description || "",
            customMessage: "Looking forward to seeing you!"
        };

        //  Save meeting
        onSave(formData);

        //  Send invites
        sendInviteEmails(formData);

        //  Execute matching workflows
        try {
            const executedCount = await executeMatchingWorkflows(meetingData);
            if (executedCount > 0) {
                console.log(` ${executedCount} workflow(s) executed for this meeting`);
                toast.success('Workflows Executed', `${executedCount} workflow(s) ran successfully.`);
            }
        } catch (error) {
            console.error(" Error executing workflows:", error);
            toast.error('Execution Failed', 'Workflows could not be executed.');
        }

        onClose();
        
        if (isEditMode) {
            toast.success('Meeting Updated', `"${formData.meetingName}" has been updated.`);
        } else {
            toast.success('Meeting Created', `"${formData.meetingName}" has been scheduled.`);
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

    const getTodayDate = () =>{
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const getMinDate = () =>{
        return getTodayDate();
    }

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
                                        min={getMinDate()}
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
                                    <button type="button" onClick={() => setShowInviteeModal(true)}>
                                        <FaPlus /> Add Invitee
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
                        <button type="submit" className="save-meeting-btn" disabled={isSending}>
                            {isSending
                                ? "Sending invites..."
                                : isEditMode ? "Update Meeting" : "Save Meeting"}
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