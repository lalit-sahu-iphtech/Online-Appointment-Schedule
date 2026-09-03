
import { useState, useEffect } from "react";
import { 
  FaTimes, 
  FaPlus, 
  FaTrash, 
  FaChevronDown, 
  FaCheck, 
  FaEdit, 
  FaEnvelope, 
  FaBell, 
  FaSms, 
  FaGlobe, 
  FaCalendarPlus, 
  FaList,       
  FaComment 
} from "react-icons/fa";
import "./createWorkflowModal.css";
import emailActionIcon from "../../assets/images/before-icon.png";
import { useToast } from "../Toast";

//  Action Types Configuration — Updated icon
const ACTION_TYPES = [
  { id: "email", label: "Send Email", icon: FaEnvelope, color: "#8755D5", description: "Send email to invitees" },
  { id: "notification", label: "Send Notification", icon: FaBell, color: "#2F80D7", description: "Send push notification" },
  { id: "sms", label: "Send SMS", icon: FaSms, color: "#27AE60", description: "Send text message" },
  { id: "webhook", label: "Webhook", icon: FaGlobe, color: "#F2994A", description: "Call external API" },
  { id: "calendar", label: "Add to Calendar", icon: FaCalendarPlus, color: "#E84C8A", description: "Create calendar event" },
  { id: "task", label: "Create Task", icon: FaList, color: "#16A6AD", description: "Create follow-up task" },  // ✅ Fixed
  { id: "message", label: "Send Message", icon: FaComment, color: "#4A56E2", description: "Send Slack/Teams message" },
];

// ... rest of the code remains the same

export default function CreateWorkflowModal({ onClose, onSave, initialData, isEditMode }) {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Before Event/Meeting",
    trigger: "1 day before event happens",
    actions: [],
  });

  const [newAction, setNewAction] = useState({
    type: "email",
    label: "",
    config: {}
  });
  const [addingAction, setAddingAction] = useState(false);
  const [editingActionIndex, setEditingActionIndex] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);

  //  Load initial data for edit mode
  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "Before Event/Meeting",
        trigger: initialData.trigger || "1 day before event happens",
        actions: initialData.actions || [],
      });
    } else {
      setFormData({
        title: "",
        category: "Before Event/Meeting",
        trigger: "1 day before event happens",
        actions: [],
      });
    }
  }, [initialData, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //  Open Add Action Modal
  const startAddAction = () => {
    setNewAction({ type: "email", label: "", config: {} });
    setEditingActionIndex(null);
    setShowActionModal(true);
  };

  //  Edit existing action
  const editAction = (index) => {
    const action = formData.actions[index];
    setNewAction({
      type: action.type || "email",
      label: action.label || action,
      config: action.config || {}
    });
    setEditingActionIndex(index);
    setShowActionModal(true);
  };

  //  Confirm Add/Edit Action
  const confirmAddAction = () => {
    if (!newAction.label.trim()) {
      toast.warning('⚠️ Missing Label', 'Please enter action label.');
      return;
    }

    const actionData = {
      type: newAction.type,
      label: newAction.label.trim(),
      config: newAction.config || {}
    };

    if (editingActionIndex !== null) {
      //  Edit existing action
      const updatedActions = [...formData.actions];
      updatedActions[editingActionIndex] = actionData;
      setFormData({ ...formData, actions: updatedActions });
      toast.success('✏️ Action Updated', `"${newAction.label}" has been updated.`);
    } else {
      //  Add new action
      setFormData({
        ...formData,
        actions: [...formData.actions, actionData],
      });
      toast.success(' Action Added', `"${newAction.label}" has been added.`);
    }

    setShowActionModal(false);
    setNewAction({ type: "email", label: "", config: {} });
    setEditingActionIndex(null);
  };

  const removeAction = (index) => {
    const actionText = formData.actions[index].label || formData.actions[index];
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index),
    });
    toast.info(' Action Removed', `"${actionText}" has been removed.`);
  };

  //  Get action icon
  const getActionIcon = (type) => {
    const actionType = ACTION_TYPES.find(t => t.id === type);
    return actionType ? actionType.icon : FaEnvelope;
  };

  //  Get action color
  const getActionColor = (type) => {
    const actionType = ACTION_TYPES.find(t => t.id === type);
    return actionType ? actionType.color : "#8755D5";
  };
  //  Get action label
  const getActionLabel = (action) => {
    if (typeof action === 'string') return action;
    return action.label || action.type || "Action";
  };

  //  Get action type label
  const getActionTypeLabel = (type) => {
    const actionType = ACTION_TYPES.find(t => t.id === type);
    return actionType ? actionType.label : "Action";
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
    
    //  Format actions for save
    const formattedActions = formData.actions.map(action => {
      if (typeof action === 'string') {
        return { type: "email", label: action, config: {} };
      }
      return action;
    });
    
    const newWorkflow = {
      ...formData,
      actions: formattedActions,
      description: `${formData.trigger} — ${formData.actions.map(a => a.label || a).join(", ")}`,
    };
    
    onSave(newWorkflow);
    
    if (isEditMode) {
      toast.success(' Workflow Updated!', `"${formData.title}" has been updated.`);
    } else {
      toast.success(' Workflow Created!', `"${formData.title}" has been created.`);
    }
    onClose();
  };

  //  Action Modal
  const renderActionModal = () => {
    if (!showActionModal) return null;

    const selectedType = ACTION_TYPES.find(t => t.id === newAction.type);
    const Icon = selectedType?.icon || FaEnvelope;

    return (
      <div className="action-modal-overlay" onClick={() => setShowActionModal(false)}>
        <div className="action-modal" onClick={(e) => e.stopPropagation()}>
          <div className="action-modal-header">
            <h3>{editingActionIndex !== null ? "✏️ Edit Action" : "➕ Add Action"}</h3>
            <button className="action-modal-close" onClick={() => setShowActionModal(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="action-modal-body">
            {/* Action Type */}
            <div className="action-form-group">
              <label>Action Type</label>
              <div className="action-type-grid">
                {ACTION_TYPES.map((type) => {
                  const TypeIcon = type.icon;
                  const isSelected = newAction.type === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      className={`action-type-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => setNewAction({ ...newAction, type: type.id })}
                      style={{ borderColor: isSelected ? type.color : '#e5e7eb' }}
                    >
                      <TypeIcon style={{ color: type.color }} />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Label */}
            <div className="action-form-group">
              <label>Action Label <span className="required-star">*</span></label>
              <input
                type="text"
                value={newAction.label}
                onChange={(e) => setNewAction({ ...newAction, label: e.target.value })}
                placeholder="e.g., Send reminder email to guests"
                className="action-label-input"
                autoFocus
              />
            </div>

            {/*  Dynamic Config based on action type */}
            <div className="action-form-group">
              <label>Configuration</label>
              <div className="action-config-area">
                <div className="action-config-preview">
                  <Icon style={{ color: selectedType?.color }} />
                  <span>{selectedType?.description || "Configure this action"}</span>
                </div>
                
                {/*  Type-specific config */}
                {newAction.type === "email" && (
                  <div className="action-config-fields">
                    <input
                      type="text"
                      placeholder="Email subject (optional)"
                      value={newAction.config?.subject || ""}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        config: { ...newAction.config, subject: e.target.value }
                      })}
                    />
                  </div>
                )}
                
                {newAction.type === "webhook" && (
                  <div className="action-config-fields">
                    <input
                      type="text"
                      placeholder="Webhook URL"
                      value={newAction.config?.url || ""}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        config: { ...newAction.config, url: e.target.value }
                      })}
                    />
                  </div>
                )}
                
                {newAction.type === "notification" && (
                  <div className="action-config-fields">
                    <input
                      type="text"
                      placeholder="Notification title"
                      value={newAction.config?.title || ""}
                      onChange={(e) => setNewAction({
                        ...newAction,
                        config: { ...newAction.config, title: e.target.value }
                      })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="action-modal-footer">
            <button className="action-cancel-btn" onClick={() => setShowActionModal(false)}>
              Cancel
            </button>
            <button className="action-add-btn" onClick={confirmAddAction}>
              {editingActionIndex !== null ? " Update Action" : " Add Action"}
            </button>
          </div>
        </div>
      </div>
    );
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
              toast.info(' Cancelled', 'Workflow creation cancelled.');
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
                {formData.actions.map((action, index) => {
                  const actionLabel = getActionLabel(action);
                  const actionType = action.type || "email";
                  const Icon = getActionIcon(actionType);
                  const color = getActionColor(actionType);
                  
                  return (
                    <div key={index} className="action-card-item">
                      <div className="action-card-left">
                        <div className="action-icon-wrapper" style={{ backgroundColor: color + '20', color: color }}>
                          <Icon />
                        </div>
                        <span className="action-title">{actionLabel}</span>
                        <span className="action-type-badge">{getActionTypeLabel(actionType)}</span>
                      </div>

                      <div className="action-card-right">
                        <button type="button" className="action-btn-edit" onClick={() => editAction(index)}>
                          <FaEdit />
                        </button>
                        <button type="button" className="action-btn-delete" onClick={() => removeAction(index)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Action Button */}
              <div className="add-action-container">
                <button type="button" className="add-action-link" onClick={startAddAction}>
                  <FaPlus /> Add action
                </button>
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

      {/*  Action Modal */}
      {renderActionModal()}
    </div>
  );
}