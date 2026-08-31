// src/context/AppointmentContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AppointmentContext = createContext();

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppointments(parsed);
      } catch (e) {
        console.error('Error loading appointments:', e);
        setAppointments([]);
      }
    } else {
      setAppointments([]);
    }
    setLoading(false);
  }, []);

  // Save to localStorage whenever appointments change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments, loading]);

  const addAppointment = (newAppointment, targetMonth) => {
    const monthUpper = targetMonth.toUpperCase();
    
    setAppointments(prev => {
      const existingMonth = prev.find(m => m.month === monthUpper);
      
      let newAppointments;
      if (existingMonth) {
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
        newAppointments = [
          ...prev,
          {
            month: monthUpper,
            events: "1 Event",
            appointments: [newAppointment]
          }
        ];
      }
      
      return newAppointments;
    });
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => {
      const newAppointments = prev
        .map(month => ({
          ...month,
          appointments: month.appointments.filter(apt => apt.id !== id),
          events: `${month.appointments.filter(apt => apt.id !== id).length} Event${month.appointments.filter(apt => apt.id !== id).length !== 1 ? 's' : ''}`
        }))
        .filter(month => month.appointments.length > 0);
      
      return newAppointments;
    });
  };

  const updateAppointment = (updatedAppointment) => {
    setAppointments(prev => {
      const newAppointments = prev.map(month => ({
        ...month,
        appointments: month.appointments.map(apt => 
          apt.id === updatedAppointment.id ? updatedAppointment : apt
        ),
        events: `${month.appointments.length} Event${month.appointments.length !== 1 ? 's' : ''}`
      }));
      
      return newAppointments;
    });
  };

  // ✅ Sync appointments from Firebase (called by AppointmentSchedule)
  const syncAppointments = (data) => {
    if (!data || data.length === 0) {
      setAppointments([]);
      return;
    }

    // Group appointments by month
    const monthsMap = {};
    data.forEach(apt => {
      const month = apt.month || apt.targetMonth || 
        new Date(apt.date).toLocaleString('default', { month: 'long' }).toUpperCase();
      if (!monthsMap[month]) {
        monthsMap[month] = { month, appointments: [] };
      }
      monthsMap[month].appointments.push(apt);
    });

    const groupedAppointments = Object.values(monthsMap);
    setAppointments(groupedAppointments);
    setLoading(false);
  };

  const value = {
    appointments,
    loading,
    addAppointment,
    deleteAppointment,
    updateAppointment,
    syncAppointments,
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