// src/component/Workflows/WorkflowCard.jsx
import { FaEdit, FaTrash, FaPlay } from "react-icons/fa";
import "./WorkflowCard.css";
import { useToast } from "../Toast";

import emailIconBefore from "../../assets/images/before-icon.png";
import emailIconAfter from "../../assets/images/after-icon.png";

export default function WorkflowCard({ 
  workflow, 
  onUse, 
  onEdit, 
  onDelete, 
  onExecute,
  isTemplate = true,
  isReadOnly = false
}) {
  const toast = useToast();
  const { id, title, description, category } = workflow;

  const isBefore = category === "Before Event/Meeting";

  const handleUse = () => {
    onUse(id);
    toast.success('Workflow Activated', `"${title}" has been activated.`);
  };

  const handleEdit = () => {
    if (isReadOnly) {
      toast.warning('Read Only', 'Default templates cannot be edited.');
      return;
    }
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    if (isReadOnly) {
      toast.warning('Read Only', 'Default templates cannot be deleted.');
      return;
    }
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute(id);
    }
  };

  return (
    <div className={`workflow-card ${isBefore ? "card-before" : "card-after"} ${isReadOnly ? "readonly" : ""}`}>
      <div className="workflow-card-left-border" />

      <div className="workflow-card-body">
        <div className="workflow-card-header">
          <div className="workflow-card-title-wrap">
            <div className="workflow-card-title-row">
              <h3 className="workflow-card-title">
                {title}
                {isReadOnly && (
                  <span className="workflow-card-lock" title="Default template - Read only">
                    🔒
                  </span>
                )}
              </h3>
              
              <div className="workflow-card-actions">
                <button 
                  className={`workflow-card-edit-btn ${isReadOnly ? 'readonly' : ''}`}
                  onClick={handleEdit}
                  title={isReadOnly ? "Default template - Cannot edit" : "Edit workflow"}
                  disabled={isReadOnly}
                >
                  <FaEdit />
                </button>
                <button 
                  className={`workflow-card-delete-btn ${isReadOnly ? 'readonly' : ''}`}
                  onClick={handleDelete}
                  title={isReadOnly ? "Default template - Cannot delete" : "Delete workflow"}
                  disabled={isReadOnly}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="workflow-card-description">{description}</p>
            
            <span className="workflow-card-badge">
              {isTemplate ? "📋 Template" : "⚡ My Workflow"}
            </span>
          </div>

          <div className="workflow-card-icon">
            <img
              src={isBefore ? emailIconBefore : emailIconAfter}
              alt="Email Icon"
            />
          </div>
        </div>

        <div className="workflow-card-footer">
          <button className="workflow-card-use-btn" onClick={handleUse}>
            Use workflow
          </button>
          {isReadOnly && (
            <span className="workflow-card-readonly-badge">Read Only</span>
          )}
        </div>
      </div>
    </div>
  );
}