
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import AddMeetingModal from "./AddMeetingModal";
import "./calendar.css";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import EventDetailsModal from "./EventDetailsModal";
import { getRandomEventColor } from "../../utils/colorUtils";
import Reminder from "./Reminder";
import {
  getWeekDays,
  formatDate,
  getDayDate,
  getMonthYear,
} from "../../utils/dateUtils";
import Topbar from "../Comman/Topbar";
import { useNotifications } from "../../hooks/useNotifications";
import { useNotificationsContext } from "../../context/NotificationContext";
import { useToast } from "../Toast";
import {
  getMeetings,
  addMeeting as firebaseAddMeeting,
  updateMeeting as firebaseUpdateMeeting,
  deleteMeeting as firebaseDeleteMeeting
} from "../../services/firestoreService";

//  Import workflow functions for Reminder + Thank You
import {
  executeReminderWorkflows,
  executeThankYouWorkflows
} from "../../services/workflowExecutor";

//  SIMPLE TRACKING
const SENT_KEY = "meeting_emails_sent";
const REMINDER_SENT_KEY = "reminder_sent_ids";
const THANKYOU_SENT_KEY = "thankyou_sent_ids";

//  Simple functions
const getSent = () => JSON.parse(localStorage.getItem(SENT_KEY) || "{}");
const setSent = (data) => localStorage.setItem(SENT_KEY, JSON.stringify(data));
const isSent = (id, type) => {
  const sent = getSent();
  return !!sent[`${id}_${type}`];
};
const markSent = (id, type) => {
  const sent = getSent();
  sent[`${id}_${type}`] = new Date().toISOString();
  setSent(sent);
};

//  Reminder/Thank You tracking functions
const getSentIds = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const addSentId = (key, id) => {
  const ids = getSentIds(key);
  if (!ids.includes(id)) {
    ids.push(id);
    localStorage.setItem(key, JSON.stringify(ids));
  }
};

export default function Calendar({ onEventsChange, onDateChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [currentUser, setCurrentUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [meeting, setMeeting] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [now, setNow] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  //  Refs
  const isSendingRef = useRef(false);
  const isDeletingRef = useRef(false);
  const isProcessingWorkflowsRef = useRef(false);

  const { addNotifications } = useNotificationsContext();

  // Auth
  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) { navigate("/signin"); return; }
    try {
      setCurrentUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("currentUser");
      navigate("/signin");
      return;
    }
    setCheckingAuth(false);
  }, [navigate, location.pathname]);

  // Timer - har 30 second mein update
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Load meetings
  useEffect(() => { loadMeetings(); }, []);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await getMeetings();
      const formattedData = data.map(item => ({
        ...item,
        id: item.id,
        color: item.color || getRandomEventColor(item.id)?.id || "purple",
        date: item.date || new Date().toISOString().split('T')[0],
        startTime: item.startTime || "09:00",
        endTime: item.endTime || "10:00"
      }));
      setMeeting(formattedData);
      if (onEventsChange) onEventsChange(formattedData);
    } catch (error) {
      toast.error('Load Failed', 'Failed to load meetings.');
    } finally {
      setLoading(false);
    }
  };


  //  SEND EMAIL - Invite + Cancel
 
  const sendEmail = async (meetingData, type) => {
    const id = meetingData.id;
    
    if (isSent(id, type)) {
      return false;
    }

    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    
    let TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    if (type === 'cancel' && import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE_ID) {
      TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CANCELLATION_TEMPLATE_ID;
    }

    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const invitees = meetingData.invitees || [];
    
    if (invitees.length === 0) {
      return false;
    }


    let failed = 0;

    for (const person of invitees) {
      try {
        const params = {
          to_name: person.name || "Guest",
          to_email: person.email,
          meeting_name: meetingData.meetingName,
          meeting_date: meetingData.date || new Date().toISOString().split('T')[0],
          start_time: meetingData.startTime || "10:00",
          end_time: meetingData.endTime || "11:00",
          meeting_location: meetingData.location || "Online",
          online_link: meetingData.onlineLink || "https://meet.google.com/",
          organizer_name: user?.email?.split('@')[0] || "Organizer",
          organizer_email: user?.email || "organizer@example.com",
        };

        if (type === 'cancel') {
          params.cancellation_reason = "Meeting cancelled by organizer";
          params.cancellation_message = "We apologize for any inconvenience.";
        }

        await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY);
      } catch (err) {
        failed++;
      }
    }

    if (failed < invitees.length) {
      markSent(id, type);
      const msg = type === 'invite' ? 'Invitations Sent' : 'Cancellation Sent';
      toast.success(msg, `Sent to ${invitees.length - failed} people!`);
      return true;
    } else {
      toast.error('Email Failed', 'Could not send emails.');
      return false;
    }
  };


  // ✅ REMINDER + THANK YOU - Workflow Based

  useEffect(() => {
    if (meeting.length === 0) {
      return;
    }

    if (isProcessingWorkflowsRef.current) {
      return;
    }

    isProcessingWorkflowsRef.current = true;

    const remindedIds = getSentIds(REMINDER_SENT_KEY);
    const thankedIds = getSentIds(THANKYOU_SENT_KEY);

    const processMeeting = async (item) => {
      if (!item.date || !item.startTime) {
        return;
      }

      try {
        const [year, month, day] = item.date.split("-").map(Number);
        const [startH, startM] = item.startTime.split(":").map(Number);
        const startDateTime = new Date(year, month - 1, day, startH, startM, 0);

        const [endH, endM] = (item.endTime || item.startTime).split(":").map(Number);
        const endDateTime = new Date(year, month - 1, day, endH, endM, 0);

        const hoursUntilStart = (startDateTime - now) / (1000 * 60 * 60);

       

        //  REMINDER: Within 24 hours AND not started AND not already sent
        if (hoursUntilStart > 0 && hoursUntilStart <= 24 && !remindedIds.includes(item.id)) {
          try {
            await executeReminderWorkflows(item);
            addSentId(REMINDER_SENT_KEY, item.id);
          } catch (error) {
            console.log(error);
          }
        } 

        // THANK YOU: Meeting finished AND not already sent
        if (now > endDateTime && !thankedIds.includes(item.id)) {
          try {
            await executeThankYouWorkflows(item);
            addSentId(THANKYOU_SENT_KEY, item.id);
          } catch (error) {
            console.error(`Error sending thank you for ${item.id}:`, error);
          }
        } 
      } catch (error) {
        console.error(`Error processing meeting ${item.id}:`, error);
      }
    };

    const promises = meeting.map(item => processMeeting(item));
    Promise.all(promises).finally(() => {
      isProcessingWorkflowsRef.current = false;
    });

  }, [now, meeting]);


  // SAVE MEETING

  const handleSaveMeeting = async (data) => {
    if (isSendingRef.current) {
      return;
    }

    const loadingToast = toast.loading('Creating Meeting...', 'Please wait');
    
    try {
      isSendingRef.current = true;
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

      const newMeeting = {
        ...data,
        organizerEmail: user?.email || "unknown",
        organizerName: user?.email?.split('@')[0] || "User"
      };

      const saved = await firebaseAddMeeting(newMeeting);
      console.log(` Meeting saved: ${saved.id}`);
      
      await loadMeetings();

      if (data.invitees && data.invitees.length > 0) {
        await sendEmail({ ...data, id: saved.id }, 'invite');
      }

      loadingToast.success('Meeting Created!', `"${data.meetingName}" scheduled.`);
    } catch (error) {
      console.error("Error saving meeting:", error);
      loadingToast.error('Creation Failed', error.message);
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleUpdateMeeting = async (id, data) => {
    const loadingToast = toast.loading('Updating Meeting...', 'Please wait');
    try {
      await firebaseUpdateMeeting(id, data);
      await loadMeetings();
      loadingToast.success('Meeting Updated!', `"${data.meetingName}" updated.`);
    } catch (error) {
      console.error("Error updating meeting:", error);
      loadingToast.error('Update Failed', error.message);
    }
  };

 
  // DELETE MEETING
 
  const handleDeleteMeeting = async (id) => {
    if (isDeletingRef.current) {
      return;
    }

    if (!window.confirm('Delete this meeting?')) return;

    const meetingToCancel = meeting.find(m => m.id === id);
    if (!meetingToCancel) {
      toast.error('Error', 'Meeting not found');
      return;
    }

    const loadingToast = toast.loading('Deleting Meeting...', 'Please wait');

    try {
      isDeletingRef.current = true;

      if (meetingToCancel.invitees && meetingToCancel.invitees.length > 0) {
        await sendEmail({ ...meetingToCancel, id: id }, 'cancel');
      }

      await firebaseDeleteMeeting(id);
      await loadMeetings();

      loadingToast.success('Meeting Deleted!', 'Meeting removed successfully.');
    } catch (error) {
      console.error("Error deleting meeting:", error);
      loadingToast.error('Delete Failed', error.message);
    } finally {
      isDeletingRef.current = false;
    }
  };


  // NOTIFICATIONS

  const {
    notifications: upcomingNotifications,
    count: notificationCount,
    getLabel,
  } = useNotifications(meeting, 60);

  useEffect(() => {
    if (upcomingNotifications.length === 0) return;
    const formattedNotifications = upcomingNotifications.map(n => ({
      id: n.id,
      title: n.title,
      diffMinutes: n.diffMinutes,
      date: n.date,
      time: n.startTime,
      location: n.location,
      source: "calendar",
    }));
    addNotifications("calendar", formattedNotifications);
  }, [upcomingNotifications, addNotifications]);

  // Comments
  const meetingsWithComments = meeting.filter(item => item.comments && item.comments.length > 0);

  const addComment = (eventId, text) => {
    const newComment = { id: Date.now(), text, time: new Date().toISOString() };
    setMeeting(prev =>
      prev.map(m =>
        m.id === eventId ? { ...m, comments: [...(m.comments || []), newComment] } : m
      )
    );
    setSelectedEvent(prev =>
      prev && prev.id === eventId
        ? { ...prev, comments: [...(prev.comments || []), newComment] }
        : prev
    );
    toast.success('Comment Added', 'Your comment has been added.');
  };

  // Search
  const searchResults = searchTerm.trim()
    ? meeting.filter(item =>
        item.meetingName?.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : [];

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() - 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(newDate.getDate() + 1);
    else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    toast.info('Today', 'Showing today\'s schedule.');
  };

  const getHeaderText = () => {
    if (view === 'day') {
      return getDayDate(currentDate);
    } else if (view === 'week') {
      const weekDays = getWeekDays(currentDate);
      const start = weekDays[0];
      const end = weekDays[6];
      const startMonth = start.toLocaleString('default', { month: 'short' });
      const endMonth = end.toLocaleString('default', { month: 'short' });
      const year = start.getFullYear();
      if (startMonth === endMonth) {
        return `${startMonth} ${start.getDate()} - ${end.getDate()}, ${year}`;
      } else {
        return `${startMonth} ${start.getDate()} - ${endMonth} ${end.getDate()}, ${year}`;
      }
    } else {
      return getMonthYear(currentDate);
    }
  };

  const getEventPosition = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const calendarStartHour = 0;
    const startMinutes = startHour * 60 + startMinute - calendarStartHour * 60;
    const endMinutes = endHour * 60 + endMinute - calendarStartHour * 60;
    const top = (startMinutes / 60) * 58;
    const height = ((endMinutes - startMinutes) / 60) * 58;
    return { top, height: Math.max(height, 28) };
  };

  const getEventColor = (event) => {
    if (event.color) {
      const colors = {
        purple: { bg: '#8755D5', text: '#ffffff' },
        teal: { bg: '#16A6AD', text: '#ffffff' },
        orange: { bg: '#FF7800', text: '#ffffff' },
        blue: { bg: '#2F80D7', text: '#ffffff' },
        pink: { bg: '#E84C8A', text: '#ffffff' },
        green: { bg: '#27AE60', text: '#ffffff' },
        red: { bg: '#E74C3C', text: '#ffffff' },
        yellow: { bg: '#F2C94C', text: '#1a1a1a' },
        indigo: { bg: '#4A56E2', text: '#ffffff' },
        brown: { bg: '#8B5E3C', text: '#ffffff' },
      };
      return colors[event.color] || colors.purple;
    }
    const color = getRandomEventColor(event.id);
    const updatedMeeting = meeting.map(m =>
      m.id === event.id ? { ...m, color: color.id } : m
    );
    setMeeting(updatedMeeting);
    const colors = {
      purple: { bg: '#8755D5', text: '#ffffff' },
      teal: { bg: '#16A6AD', text: '#ffffff' },
      orange: { bg: '#FF7800', text: '#ffffff' },
      blue: { bg: '#2F80D7', text: '#ffffff' },
      pink: { bg: '#E84C8A', text: '#ffffff' },
      green: { bg: '#27AE60', text: '#ffffff' },
      red: { bg: '#E74C3C', text: '#ffffff' },
      yellow: { bg: '#F2C94C', text: '#1a1a1a' },
      indigo: { bg: '#4A56E2', text: '#ffffff' },
      brown: { bg: '#8B5E3C', text: '#ffffff' },
    };
    return colors[color.id] || colors.purple;
  };

  // Handlers
  const handleJoinMeeting = (event) => {
    if (event.onlineLink) {
      window.open(event.onlineLink, "_blank");
      toast.info('Joining Meeting', `Opening ${event.meetingName}...`);
    } else {
      toast.warning('No Link', 'This meeting does not have an online link.');
    }
  };

  const handleDismissReminder = (eventId) => {
    toast.info('Reminder Dismissed', 'You have dismissed this reminder.');
  };

  const handleEditMeeting = (event) => {
    setSelectedEvent(null);
    setEditingEvent(event);
    setShowMeetingModal(true);
    toast.info('Editing Meeting', `Editing "${event.meetingName}"`);
  };

  const handleShareMeeting = (event) => {
    const link = event.onlineLink || window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event.meetingName || "Meeting",
        text: `Join "${event.meetingName || "this meeting"}"`,
        url: link,
      }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(link);
    toast.success('Copied!', 'Meeting link copied to clipboard.');
  };

  // Profile
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/signin");
    toast.success('Logged Out', 'You have been logged out successfully.');
  };

  const handleProfileClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  const handleViewChange = (newView) => {
    setView(newView);
    toast.info(`${newView.charAt(0).toUpperCase() + newView.slice(1)} View`, `Switched to ${newView} view.`);
  };

  if (checkingAuth) return null;
  if (loading) return <div className="calendar-loading">Loading meetings...</div>;

  return (
    <>
      <Topbar
        title="Calendar"
        createButtonLabel="Create"
        onCreateClick={() => setShowMeetingModal(true)}
        searchPlaceholder="Search by meeting name"
        searchResults={searchResults.map(item => ({
          id: item.id,
          title: item.meetingName,
          date: item.date,
        }))}
        onSearchChange={(value) => setSearchTerm(value)}
        onSearchResultClick={(item) => {
          const event = meeting.find(m => m.id === item.id);
          if (event) {
            setSelectedEvent(event);
            toast.info('Found', `Showing "${event.meetingName}" details.`);
          }
          setSearchTerm("");
        }}
        commentsCount={meetingsWithComments.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />

      <div className="calendar-container">
        <div className="calendar-header">
          <div className="calendar-date">
            <h2>{getHeaderText()}</h2>
            <button className="arrow-btn" onClick={goToPrevious}>‹</button>
            <button className="arrow-btn" onClick={goToNext}>›</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
          <div className="calendar-view">
            <button className={view === "day" ? "view-active" : ""} onClick={() => handleViewChange("day")}>Day</button>
            <button className={view === "week" ? "view-active" : ""} onClick={() => handleViewChange("week")}>Week</button>
            <button className={view === "month" ? "view-active" : ""} onClick={() => handleViewChange("month")}>Month</button>
          </div>
        </div>

        {view === "day" && (
          <DayView
            meeting={meeting}
            getEventPosition={getEventPosition}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "week" && (
          <WeekView
            meeting={meeting}
            getEventPosition={getEventPosition}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}

        {view === "month" && (
          <MonthView
            meeting={meeting}
            getEventColor={getEventColor}
            currentDate={currentDate}
            onDelete={handleDeleteMeeting}
            onEventClick={(event) => setSelectedEvent(event)}
          />
        )}
      </div>

      {showMeetingModal && (
        <AddMeetingModal
          onClose={() => {
            setShowMeetingModal(false);
            setEditingEvent(null);
          }}
          defaultDate={formatDate(currentDate)}
          initialData={editingEvent}
          isEditMode={!!editingEvent}
          onSave={(data) => {
            if (editingEvent) {
              handleUpdateMeeting(editingEvent.id, data);
            } else {
              handleSaveMeeting(data);
            }
            setShowMeetingModal(false);
            setEditingEvent(null);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddComment={(text) => addComment(selectedEvent.id, text)}
          onEdit={handleEditMeeting}
          onShare={handleShareMeeting}
        />
      )}

      <Reminder
        events={meeting}
        onJoinMeeting={handleJoinMeeting}
        onDismiss={handleDismissReminder}
      />
    </>
  );
}