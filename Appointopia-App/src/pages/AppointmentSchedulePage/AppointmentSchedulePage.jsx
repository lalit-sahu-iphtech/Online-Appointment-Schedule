// src/pages/AppointmentSchedulePage.jsx
import { useState, useEffect, useMemo } from "react";
import AppointmentSchedule from "../../component/AppointmentSchedule/AppointmentSchedule";
import Sidebar from "../../component/Sidebar/Sidebar";
import { AppointmentProvider, useAppointments } from "../../context/AppointmentContext";

import "./appointmentSchedulePage.css";

// ✅ Wrapper component to access context
function AppointmentPageContent() {
  const { appointments, loading } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarKey, setSidebarKey] = useState(0);

  // ✅ Force sidebar update when appointments change
  useEffect(() => {
    setSidebarKey(prev => prev + 1);
  }, [appointments]);

  // ✅ Convert appointments to events format for Sidebar
  const sidebarEvents = useMemo(() => {
    const events = [];
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    console.log("🔄 Converting appointments to events:", appointments);
    
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
        // Use appointment's startTime if available, otherwise generate
        let startTime = apt.startTime;
        let endTime = apt.endTime;
        
        if (!startTime) {
          const now = new Date();
          const startHour = now.getHours() + 1;
          const startMin = now.getMinutes();
          startTime = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
          
          const durationMatch = apt.duration?.match(/(\d+)/);
          const durationMinutes = durationMatch ? parseInt(durationMatch[1]) : 60;
          const endTotalMinutes = (startHour * 60 + startMin) + durationMinutes;
          const endHour = Math.floor(endTotalMinutes / 60);
          const endMin = endTotalMinutes % 60;
          endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
        }
        
        events.push({
          id: apt.id,
          meetingName: apt.title,
          date: apt.date || dateStr,
          startTime: startTime,
          endTime: endTime,
          location: apt.location || "Room 01",
          onlineLink: apt.onlineLink || "",
          color: apt.color || "purple"
        });
      });
    });
    
    console.log("📊 Generated sidebar events:", events);
    return events;
  }, [appointments]);

  if (loading) {
    return <div className="appointment-page">Loading...</div>;
  }

  return (
    <div className="appointment-page">
      <Sidebar 
        key={sidebarKey}
        events={sidebarEvents} 
        selectedDate={selectedDate} 
      />

      <div className="appointment-main">
        <main className="appointment-content">
          <AppointmentSchedule />
        </main>
      </div>
    </div>
  );
}

export default function AppointmentSchedulePage() {
  return (
    <AppointmentProvider>
      <AppointmentPageContent />
    </AppointmentProvider>
  );
}