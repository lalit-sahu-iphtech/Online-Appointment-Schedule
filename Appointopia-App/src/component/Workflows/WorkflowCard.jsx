// src/component/Workflows/WorkflowCard.jsx
import "./WorkflowCard.css";

import emailIconBefore from "../../assets/images/before-icon.png";
import emailIconAfter from "../../assets/images/after-icon.png";

export default function WorkflowCard({ workflow, onUse }) {
  const { id, title, description, category } = workflow;

  const isBefore = category === "Before Event/Meeting";

  return (
    <div className={`workflow-card ${isBefore ? "card-before" : "card-after"}`}>
      <div className="workflow-card-left-border" />

      <div className="workflow-card-body">
        <div className="workflow-card-header">
          <div className="workflow-card-title-wrap">
            <h3 className="workflow-card-title">{title}</h3>
            <p className="workflow-card-description">{description}</p>
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