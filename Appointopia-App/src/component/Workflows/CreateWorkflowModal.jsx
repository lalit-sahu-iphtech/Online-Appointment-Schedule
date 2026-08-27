// src/component/Workflows/CreateWorkflowModal.jsx
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaChevronDown, FaCheck } from "react-icons/fa";
import "./createWorkflowModal.css";
import emailActionIcon from "../../assets/images/before-icon.png";
import { useToast } from "../Toast";

export default function CreateWorkflowModal({ onClose, onSave, initialData, isEditMode }) {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Before Event/Meeting",
    trigger: "1 day before event happens",
    actions: [],
  });

  const [newAction, setNewAction] = useState("");
  const [addingAction, setAddingAction] = useState(false);

  // ✅ Load initial data for edit mode
  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Before Event/Meeting",
        trigger: initialData.trigger || "1 day before event happens",
        actions: initialData.actions || ["Send email to guests"],
      });
    } else {
      // ✅ Default for new workflow
      setFormData({
        title: "",
        category: "Before Event/Meeting",
        trigger: "1 day before event happens",
        actions: ["Send email to guests"],
      });
    }
  }, [initialData, isEditMode]);

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
      toast.warning('⚠️ Empty Action', 'Please describe the action.');
      return;
    }
    setFormData({
      ...formData,
      actions: [...formData.actions, newAction.trim()],
    });
    setNewAction("");
    setAddingAction(false);
    toast.success('➕ Action Added', `"${newAction.trim()}" has been added.`);
  };

  const removeAction = (index) => {
    const actionText = formData.actions[index];
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index),
    });
    toast.info('🗑️ Action Removed', `"${actionText}" has been removed.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.warning('⚠️ Missing Title', 'Please enter workflow name.');
      return;
    }
    if (formData.actions.length === 0) {
      toast.warning('⚠️ No Actions', 'Please add at least one action.');
      return;
    }
    
    const newWorkflow = {
      title: formData.title,
      category: formData.category,
      trigger: formData.trigger,
      actions: formData.actions,
      description: `${formData.trigger} — ${formData.actions.join(", ")}`,
    };
    
    onSave(newWorkflow);
    
    if (isEditMode) {
      toast.success('✅ Workflow Updated!', `"${formData.title}" has been updated.`);
    } else {
      toast.success('✅ Workflow Created!', `"${formData.title}" has been created.`);
    }
    onClose();
  };
  
  return (
    <div className="workflows-overlay" onClick={onClose}>
      <div className="workflows-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="workflows-drawer-header">
          <h2>{isEditMode ? "Edit Workflow" : "Create Workflow"}</h2>
          <button 
            className="workflows-drawer-close" 
            onClick={() => {
              toast.info('❌ Cancelled', 'Workflow creation cancelled.');
              onClose();
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="workflows-drawer-body" id="create-workflow-form">
          {/* Workflow Name */}
          <div className="workflows-form-group">
            <label>Workflow Name <span className="required-star">*</span></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter workflow name"
            />
          </div>

          {/* Category */}
          <div className="workflows-form-group">
            <label>Category <span className="required-star">*</span></label>
            <div className="flow-select-wrap">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Before Event/Meeting">Before Event/Meeting</option>
                <option value="After Event/Meeting">After Event/Meeting</option>
              </select>
              <FaChevronDown className="select-arrow" />
            </div>
          </div>

          {/* Workflow Flow Diagram */}
          <div className="workflow-flow-container">
            {/* WHEN */}
            <div className="flow-box">
              <label className="flow-label">When <span className="required-star">*</span></label>
              <div className="flow-select-wrap">
                <select
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleChange}
                >
                  <option value="1 day before event happens">1 day before event happens</option>
                  <option value="2 hours before event happens">2 hours before event happens</option>
                  <option value="Immediately after event happens">Immediately after event happens</option>
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
              <label className="flow-label">Action <span className="required-star">*</span></label>

              <div className="action-cards-list">
                {formData.actions.map((actionText, index) => (
                  <div key={index} className="action-card-item">
                    <div className="action-card-left">
                      <img src={emailActionIcon} alt="Email" className="action-icon-img" />
                      <span className="action-title">{actionText}</span>
                    </div>

                    <div className="action-card-right">
                      <button type="button" className="action-btn-edit">Edit</button>
                      <button type="button" className="action-btn-delete" onClick={() => removeAction(index)}>
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
                  <button type="button" className="add-action-link" onClick={startAddAction}>
                    <FaPlus /> Add action
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="workflows-drawer-footer">
          <button type="submit" form="create-workflow-form" className="workflows-drawer-save">
            {isEditMode ? "Update" : "Save"} <FaCheck />
          </button>
        </div>
      </div>
    </div>
  );
}