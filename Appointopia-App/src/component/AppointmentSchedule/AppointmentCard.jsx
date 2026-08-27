import { useState } from "react";
import {
    FaRegClock,
    FaRegCalendarCheck,
    FaLink,
    FaShareAlt,
    FaTrash,
    FaCheck,
    FaTimes,
    FaEdit
} from "react-icons/fa";

import "./AppointmentCard.css";
import { useToast } from "../Toast";

export default function AppointmentCard({ appointment, onDelete, onUpdate, onEdit, isEditing: externalEditing }) {
    
    const toast = useToast();
    
    // ✅ Edit mode state
    const [isEditing, setIsEditing] = useState(externalEditing || false);
    
    // ✅ Edit form state
    const [editedTitle, setEditedTitle] = useState(appointment.title);
    const [editedLocation, setEditedLocation] = useState(appointment.location || "");
    const [editedDuration, setEditedDuration] = useState(appointment.duration);
    const [editedStartTime, setEditedStartTime] = useState(appointment.startTime || "09:00");
    const [editedEndTime, setEditedEndTime] = useState(appointment.endTime || "10:00");
    const [editedBookings, setEditedBookings] = useState(appointment.bookings || 0);
    const [editedColor, setEditedColor] = useState(appointment.color || "purple");
    const [editedBookingPage, setEditedBookingPage] = useState(appointment.bookingPage || "");
    
    // Available colors for appointment
    const colors = [
        { name: 'purple', bg: '#8755d5', text: '#ffffff' },
        { name: 'teal', bg: '#13a6ad', text: '#ffffff' },
        { name: 'orange', bg: '#ff8100', text: '#ffffff' },
        { name: 'blue', bg: '#2F80D7', text: '#ffffff' },
        { name: 'pink', bg: '#E84C8A', text: '#ffffff' },
        { name: 'green', bg: '#27AE60', text: '#ffffff' },
        { name: 'red', bg: '#E74C3C', text: '#ffffff' },
        { name: 'yellow', bg: '#F2C94C', text: '#1a1a1a' },
        { name: 'indigo', bg: '#4A56E2', text: '#ffffff' },
        { name: 'brown', bg: '#8B5E3C', text: '#ffffff' }
    ];

    // ✅ Share handler with toast
    const handleShare = async () => {
        const shareData = {
            title: appointment.title,
            text: `Join my appointment: ${appointment.title}`,
            url: `https://${appointment.bookingPage || 'appointopia.com'}`
        };
        
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success('📤 Shared!', `"${appointment.title}" shared successfully.`);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    toast.error('❌ Share Failed', 'Unable to share. Please try again.');
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(`https://${appointment.bookingPage || 'appointopia.com'}`);
                toast.success('📋 Copied!', 'Booking link copied to clipboard.');
            } catch (err) {
                console.error('Failed to copy:', err);
                toast.error('❌ Copy Failed', 'Unable to copy link. Please try again.');
            }
        }
    };

    // ✅ Delete handler with toast
    const handleDelete = () => {
        // ✅ Confirmation first
        if (!window.confirm(`Are you sure you want to delete "${appointment.title}"?`)) {
            return;
        }
        
        const loadingToast = toast.loading('🗑️ Deleting...', 'Please wait');
        
        try {
            onDelete(appointment.id);
            loadingToast.success(
                '✅ Deleted!',
                `"${appointment.title}" has been removed successfully.`
            );
        } catch (error) {
            loadingToast.error(
                '❌ Delete Failed',
                error.message || 'Something went wrong. Please try again.'
            );
        }
    };

    // ✅ Edit toggle function
    const handleEditToggle = () => {
        if (isEditing) {
            // ✅ Validate before saving
            if (!editedTitle.trim()) {
                toast.warning('⚠️ Missing Title', 'Please enter an appointment title.');
                return;
            }
            
            // Save changes
            const loadingToast = toast.loading('💾 Saving...', 'Please wait');
            
            try {
                const updatedData = {
                    ...appointment,
                    title: editedTitle,
                    location: editedLocation,
                    duration: editedDuration,
                    startTime: editedStartTime,
                    endTime: editedEndTime,
                    bookings: editedBookings,
                    color: editedColor,
                    bookingPage: editedBookingPage || appointment.bookingPage,
                    updatedAt: new Date().toISOString()
                };
                
                onUpdate(updatedData);
                loadingToast.success(
                    '✅ Updated!',
                    `"${editedTitle}" has been updated successfully.`
                );
            } catch (error) {
                loadingToast.error(
                    '❌ Update Failed',
                    error.message || 'Something went wrong. Please try again.'
                );
            }
        }
        setIsEditing(!isEditing);
        
        if (onEdit && !isEditing) {
            onEdit();
        }
    };

    // ✅ Cancel edit
    const handleCancelEdit = () => {
        setEditedTitle(appointment.title);
        setEditedLocation(appointment.location || "");
        setEditedDuration(appointment.duration);
        setEditedStartTime(appointment.startTime || "09:00");
        setEditedEndTime(appointment.endTime || "10:00");
        setEditedBookings(appointment.bookings || 0);
        setEditedColor(appointment.color || "purple");
        setEditedBookingPage(appointment.bookingPage || "");
        setIsEditing(false);
        toast.info('✏️ Edit Cancelled', 'Changes have been discarded.');
    };

    // ✅ Color change handler
    const handleColorChange = (colorName) => {
        setEditedColor(colorName);
        toast.info('🎨 Color Changed', `Event color set to ${colorName}`);
    };

    return (
        <div className={`appointment-card ${appointment.color} ${isEditing ? 'edit-mode' : ''}`}>
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

                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        {isEditing ? (
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
                            <>
                                <button 
                                    className="card-setting" 
                                    onClick={handleDelete}
                                    style={{ color: "#ef4444" }}
                                    title="Delete appointment"
                                >
                                    <FaTrash size={12} />
                                </button>
                                <button 
                                    className="card-setting" 
                                    onClick={handleEditToggle}
                                    title="Edit appointment"
                                >
                                    <FaEdit size={12} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {isEditing ? (
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
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
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input 
                                    type="text"
                                    value={editedDuration}
                                    onChange={(e) => setEditedDuration(e.target.value)}
                                    className="edit-input"
                                    placeholder="Duration (e.g., 30 min)"
                                    style={{ flex: 1 }}
                                />
                                <input 
                                    type="number"
                                    value={editedBookings}
                                    onChange={(e) => setEditedBookings(parseInt(e.target.value) || 0)}
                                    className="edit-input"
                                    placeholder="Bookings"
                                    style={{ width: '80px' }}
                                />
                            </div>

                            {/* ✅ Color Picker with toast on change */}
                            <div className="color-picker-container">
                                <span className="color-picker-label">Color:</span>
                                {colors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => handleColorChange(color.name)}
                                        className={`color-picker-btn ${editedColor === color.name ? 'active' : ''}`}
                                        style={{ background: color.bg }}
                                        title={color.name}
                                    />
                                ))}
                            </div>

                            <input 
                                type="text"
                                value={editedBookingPage}
                                onChange={(e) => setEditedBookingPage(e.target.value)}
                                className="edit-input"
                                placeholder="Booking page URL"
                                style={{ width: '100%' }}
                            />
                        </div>
                    ) : (
                        <>
                            <span>
                                <FaRegClock />
                                {appointment.startTime} - {appointment.endTime}
                            </span>
                            <span>
                                <FaRegClock style={{ marginLeft: '4px' }} />
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
                    <a href={`https://${appointment.bookingPage || 'appointopia.com'}`} target="_blank" rel="noreferrer">
                        <FaLink />
                        {appointment.bookingPage?.split("/")[0] || "booking"}
                    </a>
                    <button className="share-button" onClick={handleShare} title="Share appointment">
                        <FaShareAlt />
                    </button>
                </div>
            </div>
        </div>
    );
}