// src/pages/AppointmentSchedulePage.jsx
import { useState, useEffect, useMemo } from "react";
import AppointmentSchedule from "../../component/AppointmentSchedule/AppointmentSchedule";
import Sidebar from "../../component/Sidebar/Sidebar";
import { AppointmentProvider, useAppointments } from "../../context/AppointmentContext";
import "./appointmentSchedulePage.css";

//  Wrapper component to access context
function AppointmentPageContent() {
  const { appointments, loading, syncAppointments } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sidebarKey, setSidebarKey] = useState(0);

  //  Sync appointments when Schedule component updates
  const handleAppointmentsSync = (data) => {
    syncAppointments(data);
    setSidebarKey(prev => prev + 1);
  };

  // Handle date change from AppointmentSchedule
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  //  Convert appointments to events format for Sidebar
  const sidebarEvents = useMemo(() => {
    const events = [];
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    
    appointments.forEach(monthData => {
      monthData.appointments.forEach(apt => {
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
          meetingName: apt.title || apt.meetingName || "Untitled Appointment",
          date: apt.date || dateStr,
          startTime: startTime,
          endTime: endTime,
          location: apt.location || "Room 01",
          onlineLink: apt.onlineLink || "",
          color: apt.color || "purple"
        });
      });
    });
    
    return events;
  }, [appointments]);

  if (loading && appointments.length === 0) {
    return <div className="appointment-page">Loading appointments...</div>;
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
          <AppointmentSchedule 
            onAppointmentsSync={handleAppointmentsSync}
            onDateChange={handleDateChange} 
          />
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