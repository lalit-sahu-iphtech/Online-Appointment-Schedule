// src/context/AppointmentContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppointmentContext = createContext();

// Default months
const DEFAULT_MONTHS = ['JAN', 'FEB', 'MARCH', 'APRIL', 'MAY', 'JUNE', 
                        'JULY', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Get initial data from localStorage or create default
const getInitialData = () => {
  const saved = localStorage.getItem('appointments');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return createDefaultAppointments();
    }
  }
  return createDefaultAppointments();
};

const createDefaultAppointments = () => {
  const currentMonthIndex = new Date().getMonth();
  
  return DEFAULT_MONTHS.map((month, index) => {
    // Add some default appointments for current month only
    if (index === currentMonthIndex) {
      return {
        month,
        events: "2 Events",
        expanded: true,
        appointments: [
          {
            id: Date.now() + 1,
            title: "One-on-one",
            duration: "60 mins",
            bookings: "4 bookings",
            color: "teal",
            bookingPage: "link.com/one-on-one"
          },
          {
            id: Date.now() + 2,
            title: "Monthly Review",
            duration: "60 mins",
            bookings: "2 bookings",
            color: "orange",
            bookingPage: "link.com/monthly-review"
          }
        ]
      };
    }
    return {
      month,
      events: "0 Events",
      expanded: false,
      appointments: []
    };
  });
};

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(getInitialData);
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Add new appointment
  const addAppointment = (newAppointment, targetMonth) => {
    setAppointments(prev => {
      const monthIndex = prev.findIndex(m => m.month === targetMonth);
      
      if (monthIndex !== -1) {
        const updated = [...prev];
        const currentAppointments = updated[monthIndex].appointments;
        updated[monthIndex] = {
          ...updated[monthIndex],
          appointments: [...currentAppointments, newAppointment],
          events: `${currentAppointments.length + 1} Event${currentAppointments.length + 1 !== 1 ? 's' : ''}`,
          expanded: true
        };
        return updated;
      }
      
      // If month doesn't exist, create it
      return [...prev, {
        month: targetMonth,
        events: "1 Event",
        expanded: true,
        appointments: [newAppointment]
      }];
    });
  };

  // Delete appointment
  const deleteAppointment = (id) => {
    setAppointments(prev =>
      prev.map(month => ({
        ...month,
        appointments: month.appointments.filter(apt => apt.id !== id),
        events: `${month.appointments.filter(apt => apt.id !== id).length} Event${month.appointments.filter(apt => apt.id !== id).length !== 1 ? 's' : ''}`
      }))
    );
  };

  // Update appointment
  const updateAppointment = (id, updatedData) => {
    setAppointments(prev =>
      prev.map(month => ({
        ...month,
        appointments: month.appointments.map(apt =>
          apt.id === id ? { ...apt, ...updatedData } : apt
        )
      }))
    );
  };

  // Get appointments for a specific month
  const getAppointmentsByMonth = (month) => {
    const found = appointments.find(m => m.month === month);
    return found ? found.appointments : [];
  };

  // Get total appointments count
  const getTotalAppointments = () => {
    return appointments.reduce((total, month) => total + month.appointments.length, 0);
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      setAppointments,
      addAppointment,
      deleteAppointment,
      updateAppointment,
      getAppointmentsByMonth,
      getTotalAppointments,
      loading
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

// Custom hook for using appointments
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};