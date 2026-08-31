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
  isTemplate = true 
}) {
  const toast = useToast();
  const { id, title, description, category } = workflow;

  const isBefore = category === "Before Event/Meeting";

  const handleUse = () => {
    onUse(id);
    toast.success('Workflow Activated', `"${title}" has been activated.`);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
        onDelete(id);
      }
    }
  };

  const handleExecute = () => {
    if (onExecute) {
      onExecute(id);
    }
  };

  return (
    <div className={`workflow-card ${isBefore ? "card-before" : "card-after"}`}>
      <div className="workflow-card-left-border" />

      <div className="workflow-card-body">
        <div className="workflow-card-header">
          <div className="workflow-card-title-wrap">
            <div className="workflow-card-title-row">
              <h3 className="workflow-card-title">{title}</h3>
              
              <div className="workflow-card-actions">
                
                {onEdit && (
                  <button 
                    className="workflow-card-edit-btn" 
                    onClick={handleEdit}
                    title="Edit workflow"
                  >
                    <FaEdit />
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="workflow-card-delete-btn" 
                    onClick={handleDelete}
                    title="Delete workflow"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
            <p className="workflow-card-description">{description}</p>
            
            <span className="workflow-card-badge">
              {isTemplate ? "Template" : "My Workflow"}
            </span>
          </div>

          <div className="workflow-card-icon">
            <img
              src={isBefore ? emailIconBefore : emailIconAfter}
              alt="Email Icon"
            />
          </div>
        </div>

        <button className="workflow-card-use-btn" onClick={handleUse}>
          Use workflow
        </button>
      </div>
    </div>
  );
}