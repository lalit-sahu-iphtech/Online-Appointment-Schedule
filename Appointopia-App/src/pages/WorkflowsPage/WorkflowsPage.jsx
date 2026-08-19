// src/pages/WorkflowsPage/WorkflowsPage.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../component/Sidebar/Sidebar";
import Workflows from "../../component/Workflows/Workflows";
import "./WorkflowsPage.css";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarKey, setSidebarKey] = useState(0);

  // ✅ Load workflows from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('workflows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWorkflows(parsed);
      } catch (error) {
        console.error('Error loading workflows:', error);
      }
    }
  }, []);

  // ✅ Convert workflows to events format for Sidebar
  const sidebarEvents = useMemo(() => {
    const events = [];
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    workflows.forEach(workflow => {
      events.push({
        id: workflow.id,
        meetingName: workflow.title || "Workflow",
        date: dateStr,
        startTime: "10:00",
        endTime: "11:00",
        location: "Automated",
        onlineLink: "",
        color: workflow.category === "Before Event/Meeting" ? "teal" : "purple"
      });
    });
    
    return events;
  }, [workflows]);

  // ✅ Handle workflow changes from child component
  const handleWorkflowsChange = useCallback((newWorkflows) => {
    setWorkflows(newWorkflows);
    setSidebarKey(prev => prev + 1); // Force sidebar re-render
  }, []);

  return (
    <div className="workflows-page">
      <Sidebar 
        key={sidebarKey}
        events={sidebarEvents} 
        selectedDate={selectedDate} 
      />

      <div className="workflows-main">
        <main className="workflows-content">
          <Workflows 
            onWorkflowsChange={handleWorkflowsChange}
          />
        </main>
      </div>
    </div>
  );
}