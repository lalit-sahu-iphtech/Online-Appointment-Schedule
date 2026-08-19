// src/component/Workflows/CreateWorkflowModal.jsx
import { useState } from "react";
import { FaTimes, FaPlus, FaTrash, FaChevronDown, FaCheck } from "react-icons/fa";
import "./createWorkflowModal.css";

// Replace with your own action icon:
import emailActionIcon from "../../assets/images/before-icon.png";

export default function CreateWorkflowModal({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "Reminder Event Email",
    category: "Before Event/Meeting",
    trigger: "1 day before event happens",
    actions: ["Send email to guests"],
  });

  const [newAction, setNewAction] = useState("");
  const [addingAction, setAddingAction] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const startAddAction = () => setAddingAction(true);

  const confirmAddAction = () => {
    if (!newAction.trim()) {
      setAddingAction(false);
      return;
    }
    setFormData({
      ...formData,
      actions: [...formData.actions, newAction.trim()],
    });
    setNewAction("");
    setAddingAction(false);
  };

  const removeAction = (index) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter workflow name");
      return;
    }
    
    const newWorkflow = {
      title: formData.title,
      category: formData.category,
      trigger: formData.trigger,
      actions: formData.actions,
      description: `${formData.trigger} — ${formData.actions.join(", ")}`,
    };
    
    // ✅ Call onSave with the new workflow
    if (onSave) {
      onSave(newWorkflow);
    }
    
    onClose();
  };
  
  return (
    <div className="workflows-overlay" onClick={onClose}>
      <div className="workflows-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="workflows-drawer-header">
          <h2>Create Workflow</h2>
          <button className="workflows-drawer-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="workflows-drawer-body"
          id="create-workflow-form"
        >
          {/* Workflow Name */}
          <div className="workflows-form-group">
            <label>Workflow Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Reminder Event Email"
            />
          </div>

          {/* Workflow Flow Diagram */}
          <div className="workflow-flow-container">
            {/* WHEN */}
            <div className="flow-box">
              <label className="flow-label">When</label>
              <div className="flow-select-wrap">
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleChange}
                >
                  <option value="1 day before event happens">
                    1 day before event happens
                  </option>
                  <option value="2 hours before event happens">
                    2 hours before event happens
                  </option>
                  <option value="Immediately after event happens">
                    Immediately after event happens
                  </option>
                </select>
                <FaChevronDown className="select-arrow" />
              </div>
            </div>

            {/* CONNECTOR */}
            <div className="flow-connector">
              <div className="connector-line" />
              <div className="connector-dot top-dot" />
              <span className="automatically-badge">Automatically</span>
              <div className="connector-dot bottom-dot" />
            </div>

            {/* ACTION */}
            <div className="flow-box">
              <label className="flow-label">Action</label>

              <div className="action-cards-list">
                {formData.actions.map((actionText, index) => (
                  <div key={index} className="action-card-item">
                    <div className="action-card-left">
                      <img
                        src={emailActionIcon}
                        alt="Email"
                        className="action-icon-img"
                      />
                      <span className="action-title">{actionText}</span>
                    </div>

                    <div className="action-card-right">
                      <button type="button" className="action-btn-edit">
                        Edit
                      </button>
                      <button
                        type="button"
                        className="action-btn-delete"
                        onClick={() => removeAction(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Action */}
              <div className="add-action-container">
                {addingAction ? (
                  <div className="flow-select-wrap">
                    <input
                      type="text"
                      autoFocus
                      value={newAction}
                      onChange={(e) => setNewAction(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          confirmAddAction();
                        }
                      }}
                      onBlur={confirmAddAction}
                      placeholder="Describe the action..."
                      style={{
                        width: "100%",
                        height: "40px",
                        border: "1px solid #e1e3e8",
                        borderRadius: "10px",
                        padding: "0 14px",
                        fontSize: "13px",
                        fontFamily: "Poppins, sans-serif",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="add-action-link"
                    onClick={startAddAction}
                  >
                    <FaPlus /> Add action
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="workflows-drawer-footer">
          <button
            type="submit"
            form="create-workflow-form"
            className="workflows-drawer-save"
          >
            Save <FaCheck />
          </button>
        </div>
      </div>
    </div>
  );
}