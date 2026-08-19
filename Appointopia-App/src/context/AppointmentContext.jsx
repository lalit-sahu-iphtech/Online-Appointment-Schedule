// src/context/AppointmentContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    console.log("📂 Loading appointments from localStorage:", saved);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("✅ Loaded appointments:", parsed);
        setAppointments(parsed);
      } catch (e) {
        console.error('Error loading appointments:', e);
        setAppointments([]);
      }
    } else {
      // ✅ Default appointments if nothing in localStorage
      const defaultAppointments = [
        {
          month: "AUG",
          events: "1 Event",
          appointments: [
            {
              id: Date.now(),
              title: "Sample Meeting",
              location: "Room 01",
              onlineLink: "meet.com",
              duration: "60 mins",
              bookings: "0 bookings",
              bookingPage: "meet.com/sample",
              color: "teal",
              startTime: "10:00",
              endTime: "11:00",
              date: new Date().toISOString().split('T')[0]
            }
          ]
        }
      ];
      localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
      setAppointments(defaultAppointments);
    }
    setLoading(false);
  }, []);

  // ✅ Save to localStorage whenever appointments change
  useEffect(() => {
    if (!loading) {
      console.log("💾 Saving appointments to localStorage:", appointments);
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments, loading]);

  const addAppointment = (newAppointment, targetMonth) => {
    const monthUpper = targetMonth.toUpperCase();
    console.log("📝 Adding appointment:", newAppointment, "to month:", monthUpper);
    
    setAppointments(prev => {
      const existingMonth = prev.find(m => m.month === monthUpper);
      
      let newAppointments;
      if (existingMonth) {
        // Add to existing month
        newAppointments = prev.map(m => 
          m.month === monthUpper 
            ? { 
                ...m, 
                appointments: [...m.appointments, newAppointment],
                events: `${m.appointments.length + 1} Event${m.appointments.length + 1 !== 1 ? 's' : ''}`
              }
            : m
        );
      } else {
        // Create new month
        newAppointments = [
          ...prev,
          {
            month: monthUpper,
            events: "1 Event",
            appointments: [newAppointment]
          }
        ];
      }
      
      console.log("✅ New appointments:", newAppointments);
      return newAppointments;
    });
  };

  const deleteAppointment = (id) => {
    console.log("🗑️ Deleting appointment:", id);
    setAppointments(prev => {
      const newAppointments = prev
        .map(month => ({
          ...month,
          appointments: month.appointments.filter(apt => apt.id !== id),
          events: `${month.appointments.filter(apt => apt.id !== id).length} Event${month.appointments.filter(apt => apt.id !== id).length !== 1 ? 's' : ''}`
        }))
        .filter(month => month.appointments.length > 0);
      
      console.log("✅ After delete:", newAppointments);
      return newAppointments;
    });
  };

  const value = {
    appointments,
    loading,
    addAppointment,
    deleteAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within AppointmentProvider');
  }
  return context;
};