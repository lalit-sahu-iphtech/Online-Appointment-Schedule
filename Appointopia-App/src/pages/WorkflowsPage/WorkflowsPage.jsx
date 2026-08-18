// src/pages/WorkflowsPage/WorkflowsPage.jsx
import Sidebar from "../../component/Sidebar/Sidebar";
import Workflows from "../../component/Workflows/Workflows";
import "./WorkflowsPage.css";

export default function WorkflowsPage() {
  return (
    <div className="workflows-page">
      <Sidebar />

      <div className="workflows-main">
        <main className="workflows-content">
          <Workflows />
        </main>
      </div>
    </div>
  );
}