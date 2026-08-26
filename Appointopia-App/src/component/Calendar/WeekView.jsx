// src/component/Calendar/WeekView.jsx
import { FaTimes } from "react-icons/fa";
import { getWeekDays, formatDate, isToday } from "../../utils/dateUtils";
import "./calendar.css";
import { useState } from "react";

export default function WeekView({ 
  meeting, 
  getEventPosition, 
  getEventColor,
  currentDate, 
  onDelete, 
  onEventClick 
}) {
  
  const weekDays = getWeekDays(currentDate);
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // ✅ State to track expanded meetings per day
  const [expandedMeetings, setExpandedMeetings] = useState({});

  const toggleExpand = (key) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // ✅ 24-hour format without AM/PM
  const timeSlots = [];
  for (let i = 0; i <24; i++) {
    // const hour = i > 12 ? i - 12 : i;
   
    const hour = String(i).padStart(2, '0');
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hour}:00 ${ampm}`);
  }

  // Header (62px) + har hour slot (58px) ka total height
  const headerHeight = 62;
  const totalHeight = headerHeight + timeSlots.length * 58;

  // ✅ Group events by day and start time
  const getGroupedEvents = (dayEvents) => {
    const groups = {};
    dayEvents.forEach(event => {
      const key = event.startTime;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });
    return groups;
  };

  // ✅ Render events with +X more for a day
  const renderDayEvents = (dayEvents, dayIndex, isTodayDate) => {
    if (dayEvents.length === 0) {
      return null;
    }

    const groups = getGroupedEvents(dayEvents);
    const dayKey = `day-${dayIndex}`;

    return Object.keys(groups).map((timeKey) => {
      const events = groups[timeKey];
      const groupKey = `${dayKey}-${timeKey}`;
      const isExpanded = expandedMeetings[groupKey] || false;
      const visibleEvents = isExpanded ? events : events.slice(0, 1);
      const hiddenCount = events.length - 1;

      return visibleEvents.map((item, index) => {
        const { top, height } = getEventPosition(item.startTime, item.endTime);
        const color = getEventColor(item);
        
        const offsetTop = isExpanded ? index * 28 : 0;
        const eventHeight = isExpanded ? Math.max(height - (index * 28), 28) : height;

        return (
          <div key={item.id}>
            <div
              className="week-event"
              style={{
                top: `${top + 62 + offsetTop}px`,
                height: `${eventHeight}px`,
                background: color.bg,
                color: color.text,
                zIndex: isExpanded ? (10 + index) : 1,
                position: 'absolute',
                left: '3px',
                right: '3px',
                borderRadius: '5px',
                padding: '9px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => onEventClick && onEventClick(item)}
            >
              <button
                type="button"
                className="delete-meeting-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <FaTimes />
              </button>
              <strong style={{ fontSize: '10px', fontWeight: 700 }}>
                {item.meetingName}
              </strong>
              <span style={{ fontSize: '9px' }}>{item.startTime}</span>
            </div>

            {/* ✅ "+X more" pill — bottom-right corner of the event box */}
            {!isExpanded && hiddenCount > 0 && index === 0 && (
              <button
                className="more-events-btn"
                style={{
                  position: 'absolute',
                  top: `${top + 62 + height - 20}px`,
                  right: '5px',
                  zIndex: 6,
                  background: 'rgba(20,20,30,0.82)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '9px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(groupKey);
                }}
              >
                +{hiddenCount} more
              </button>
            )}

            {/* ✅ "Show less" pill — bottom-right corner of the last expanded event */}
            {isExpanded && hiddenCount > 0 && index === visibleEvents.length - 1 && (
              <button
                className="show-less-btn"
                style={{
                  position: 'absolute',
                  top: `${top + 62 + offsetTop + eventHeight - 20}px`,
                  right: '5px',
                  zIndex: 20,
                  background: 'rgba(20,20,30,0.82)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '8px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(groupKey);
                }}
              >
                Show less
              </button>
            )}
          </div>
        );
      });
    });
  };

  return (
    <div className="week-calendar-body">
      <div className="week-time-column" style={{ height: `${totalHeight}px` }}>
        <div>Time</div>
        {timeSlots.map((time, index) => (
          <div key={index}>{time}</div>
        ))}
      </div>

      {weekDays.map((day, dayIndex) => {
        const dateStr = formatDate(day);
        const dayEvents = meeting.filter(item => item.date === dateStr);
        const isTodayDate = isToday(day);

        return (
          <div key={dayIndex} className="week-day" style={{ height: `${totalHeight}px` }}>
            <div className="week-day-header">
              <strong className={isTodayDate ? 'selected-date' : ''}>
                {day.getDate()}
              </strong>
              <span>{weekdays[dayIndex]}</span>
            </div>

            <div className="week-grid" style={{ height: `${timeSlots.length * 58}px` }}></div>

            {/* ✅ Render events with +X more */}
            {renderDayEvents(dayEvents, dayIndex, isTodayDate)}
          </div>
        );
      })}
    </div>
  );
}