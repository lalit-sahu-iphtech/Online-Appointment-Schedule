// src/pages/WorkflowsPage.jsx
import { useState, useEffect, useMemo } from "react";
import Workflows from "../../component/Workflows/Workflows";
import Sidebar from "../../component/Sidebar/Sidebar";
import "./workflowsPage.css";

export default function WorkflowsPage() {
    const [workflows, setWorkflows] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sidebarKey, setSidebarKey] = useState(0);

    //  Handle date change from Workflows
    const handleDateChange = (date) => {
        console.log(" Workflow date changed:", date);
        setSelectedDate(date);
    };

    // Convert workflows to events format for Sidebar
    const sidebarEvents = useMemo(() => {
        const events = [];
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        
        // Create events from user-created workflows (not templates)
        const userWorkflows = workflows.filter(w => !w.isTemplate);
        
        userWorkflows.forEach((workflow, index) => {
            const now = new Date();
            // Spread workflows across the day with 1 hour gaps
            const startHour = (now.getHours() + index + 1) % 24;
            const startTime = `${String(startHour).padStart(2, '0')}:00`;
            const endTime = `${String(startHour + 1).padStart(2, '0')}:00`;
            
            events.push({
                id: `workflow-${workflow.id}`,
                meetingName: `⚙️ ${workflow.title}`,
                date: dateStr,
                startTime: startTime,
                endTime: endTime,
                location: workflow.category || "Workflow",
                onlineLink: "",
                color: workflow.category === "Before Event/Meeting" ? "purple" : "teal",
                isWorkflow: true,
                workflowData: workflow
            });
        });
        
        console.log(" Workflow sidebar events:", events.length);
        return events;
    }, [workflows]);

    // Handle workflow changes
    const handleWorkflowsChange = (newWorkflows) => {
        console.log(" Workflows updated:", newWorkflows.length);
        setWorkflows(newWorkflows);
        setSidebarKey(prev => prev + 1);
    };

    return (
        <div className="workflows-page">
            <Sidebar 
                key={sidebarKey}
                events={sidebarEvents} 
                selectedDate={selectedDate} 
            />
            
            <div className="workflows-main">
                <Workflows 
                    onWorkflowsChange={handleWorkflowsChange}
                    onDateChange={handleDateChange}  
                />
            </div>
        </div>
    );
}