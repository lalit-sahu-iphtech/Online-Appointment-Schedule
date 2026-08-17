import { useState } from "react";
import {
    FaTimes,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPlus,
    FaLink
} from "react-icons/fa";
import "./AddMeetingModal.css";

export default function AddMeetingModal({ onClose, onSave, defaultDate }) {

    const [formData, setFormData] = useState({
        meetingName: "",
        date: defaultDate || "2023-07-18",
        startTime: "09:00",
        endTime: "10:00",
        location: "",
        onlineLink: "",
        invitees: []
    });

    const [invitee, setInvitee] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addInvitee = () => {
        if (!invitee.trim()) return;

        setFormData({
            ...formData,
            invitees: [...formData.invitees, invitee]
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

        if (!formData.meetingName.trim()) {
            alert("Please enter meeting name");
            return;
        }

        onSave(formData);
    };

    return (
        <div className="meeting-overlay">

            <div className="meeting-modal">

                {/* HEADER */}

                <div className="meeting-modal-header">

                    <h2>Add Meeting</h2>

                    <button
                        className="meeting-close-btn"
                        onClick={onClose}
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="meeting-form-body">

                        {/* Meeting Name */}

                        <div className="form-group full-width">

                            <label>Meeting Name</label>

                            <input
                                type="text"
                                name="meetingName"
                                value={formData.meetingName}
                                onChange={handleChange}
                                placeholder="Meeting Name"
                            />

                        </div>


                        {/* DATE + TIME */}

                        <div className="form-row">

                            <div className="form-group">

                                <label>Date</label>

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

                                <label>Time</label>

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
                                        placeholder="Link.com"
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

                                    <div
                                        className="invitee-chip"
                                        key={index}
                                    >

                                        <span>{person}</span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeInvitee(index)
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                ))}


                                <div className="add-invitee">

                                    <input
                                        type="text"
                                        value={invitee}
                                        onChange={(e) =>
                                            setInvitee(e.target.value)
                                        }
                                        placeholder="Add"
                                    />

                                    <button
                                        type="button"
                                        onClick={addInvitee}
                                    >
                                        <FaPlus />
                                        Add
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="meeting-modal-footer">

                        <button
                            type="button"
                            className="advanced-btn"
                        >
                            Advanced settings
                        </button>

                        <button
                            type="submit"
                            className="save-meeting-btn"
                        >
                            Save
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}