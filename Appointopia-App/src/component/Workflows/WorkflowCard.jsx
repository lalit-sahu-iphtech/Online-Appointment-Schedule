// src/component/Workflows/WorkflowCard.jsx
import { FaEdit, FaTrash } from "react-icons/fa";
import "./WorkflowCard.css";

import emailIconBefore from "../../assets/images/before-icon.png";
import emailIconAfter from "../../assets/images/after-icon.png";

export default function WorkflowCard({ 
  workflow, 
  onUse, 
  onEdit, 
  onDelete, 
  isTemplate = true 
}) {
  const { id, title, description, category } = workflow;

  const isBefore = category === "Before Event/Meeting";

  return (
    <div className={`workflow-card ${isBefore ? "card-before" : "card-after"}`}>
      <div className="workflow-card-left-border" />

      <div className="workflow-card-body">
        <div className="workflow-card-header">
          <div className="workflow-card-title-wrap">
            <div className="workflow-card-title-row">
              <h3 className="workflow-card-title">{title}</h3>
              
              {/* ✅ Edit aur Delete button - Sabko dikhega */}
              <div className="workflow-card-actions">
                {onEdit && (
                  <button 
                    className="workflow-card-edit-btn" 
                    onClick={() => onEdit(id)}
                    title="Edit workflow"
                  >
                    <FaEdit />
                  </button>
                )}
                {onDelete && (
                  <button 
                    className="workflow-card-delete-btn" 
                    onClick={() => onDelete(id)}
                    title="Delete workflow"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
            <p className="workflow-card-description">{description}</p>
            
            {/* ✅ Sirf badge - Template hai toh "Template" nahi toh "My Workflow" */}
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

        <button className="workflow-card-use-btn" onClick={() => onUse(id)}>
          Use workflow
        </button>
      </div>
    </div>
  );
}