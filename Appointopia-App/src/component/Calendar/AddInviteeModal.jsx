// src/component/Calendar/AddInviteeModal.jsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "./AddInviteeModal.css";
import { useToast } from "../Toast";

export default function AddInviteeModal({ onClose, onAdd }) {
    const toast = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleAdd = () => {
        if (!name.trim()) {
            setError("Name is required");
            toast.warning("Missing Name", "Please enter a name.");
            return;
        }
        if (!isValidEmail(email.trim())) {
            setError("Enter a valid email address");
            toast.warning("Invalid Email", "Please enter a valid email address.");
            return;
        }

        onAdd({ name: name.trim(), email: email.trim() });
        toast.success("Invitee Added", name.trim() + " has been added.");
        
        setName("");
        setEmail("");
        setError("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
        }
    };

    const handleDone = () => {
        onClose();
        toast.info("Done", "Invitee modal closed.");
    };

    return (
        <div className="invitee-modal-overlay" onClick={onClose}>
            <div className="invitee-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="invitee-modal-header">
                    <h3>Add Invitee</h3>
                    <button className="invitee-modal-close" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="invitee-modal-body">
                    <div className="invitee-form-group">
                        <label>Name <span className="required-star">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter full name"
                        />
                    </div>

                    <div className="invitee-form-group">
                        <label>Email <span className="required-star">*</span></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter email address"
                        />
                    </div>

                    {error && <span className="invitee-error-text">{error}</span>}
                </div>

                <div className="invitee-modal-footer">
                    <button type="button" className="invitee-done-btn" onClick={handleDone}>
                        Done
                    </button>
                    <button type="button" className="invitee-add-btn" onClick={handleAdd}>
                        + Add Invitee
                    </button>
                </div>
            </div>
        </div>
    );
}