// src/component/Calendar/DayView.jsx
import { FaTimes } from "react-icons/fa";
import { formatDate } from "../../utils/dateUtils";
import "./calendar.css";
import { useState } from "react";

export default function DayView({ 
  meeting, 
  getEventPosition, 
  getEventColor,
  currentDate, 
  onDelete, 
  onEventClick 
}) {
  
  const dateStr = formatDate(currentDate);
  const dayEvents = meeting.filter(item => item.date === dateStr);
  
  //  State to track expanded meetings
  const [expandedMeetings, setExpandedMeetings] = useState({});

  const toggleExpand = (timeKey) => {
    setExpandedMeetings(prev => ({
      ...prev,
      [timeKey]: !prev[timeKey]
    }));
  };

  //  Group events by start time
  const groupEventsByTime = () => {
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

  const timeGroups = groupEventsByTime();

  //  24-hour format — ONLY TIME, NO AM/PM
  const timeSlots = [];
  for (let i = 0; i <24; i++) {
    // const hour = i > 12 ? i - 12 : i;
   
    const hour = String(i).padStart(2, '0');
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hour}:00 ${ampm}`);
  }

  const totalHeight = timeSlots.length * 58;

  // Render single event with +X more
  const renderEventWithMore = (events, timeKey) => {
    if (events.length === 0) return null;

    const isExpanded = expandedMeetings[timeKey] || false;
    const visibleEvents = isExpanded ? events : events.slice(0, 1);
    const hiddenCount = events.length - 1;

  
    const firstPos = getEventPosition(events[0].startTime, events[0].endTime);
    const lastIndex = visibleEvents.length - 1;
    const lastTop = firstPos.top + (isExpanded ? lastIndex * 28 : 0);
    const lastHeight = isExpanded
      ? Math.max(firstPos.height - lastIndex * 28, 28)
      : firstPos.height;

    return (
    
      <div
        key={timeKey}
        className="day-event-group"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {visibleEvents.map((item, index) => {
          //  Get event position
          const { top, height } = getEventPosition(item.startTime, item.endTime);
          const color = getEventColor(item);
          
          //  Adjust position for stacked events
          const offsetTop = isExpanded ? index * 28 : 0;
          const eventHeight = isExpanded ? Math.max(height - (index * 28), 28) : height;
          
          return (
            <div
              key={item.id}
              className="calendar-event"
              style={{
                top: `${top + offsetTop}px`,
                height: `${eventHeight}px`,
                background: color.bg,
                color: color.text,
                zIndex: isExpanded ? (10 + index) : 1,
                position: 'absolute',
                left: '4px',
                right: '4px',
                borderRadius: '6px',
                padding: '8px 15px',
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

              <strong style={{ fontSize: '11px', fontWeight: 700 }}>
                {item.meetingName}
              </strong>
              <span style={{ fontSize: '10px' }}>
                {item.startTime} - {item.endTime}
              </span>
            </div>
          );
        })}

        {/*  "+X more" pill — sits in the bottom-right corner of the event box */}
        {!isExpanded && hiddenCount > 0 && (
          <button
            className="more-events-btn"
            style={{
              position: 'absolute',
              top: `${lastTop + lastHeight - 22}px`,
              right: '8px',
              zIndex: 6,
              background: 'rgba(20,20,30,0.82)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '10px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(timeKey);
            }}
          >
            +{hiddenCount} more
          </button>
        )}

        {/*  "Show less" pill — sits in the bottom-right corner of the last expanded event */}
        {isExpanded && hiddenCount > 0 && (
          <button
            className="show-less-btn"
            style={{
              position: 'absolute',
              top: `${lastTop + lastHeight - 22}px`,
              right: '8px',
              zIndex: 20,
              background: 'rgba(20,20,30,0.82)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '3px 10px',
              fontSize: '10px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease',
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(timeKey);
            }}
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="calendar-body">
      <div className="time-column" style={{ height: `${totalHeight}px` }}>
        {timeSlots.map((time, index) => (
          <div key={index}>{time}</div>
        ))}
      </div>

      <div className="calendar-grid" style={{ height: `${totalHeight}px` }}>
        {timeSlots.map((_, index) => (
          <div 
            key={index} 
            className="grid-line"
            style={{
              borderBottom: index === timeSlots.length - 1 ? 'none' : '1px solid #e5e7eb'
            }}
          ></div>
        ))}

        {/*  Render events grouped by start time */}
        {Object.keys(timeGroups).map((timeKey) => {
          const events = timeGroups[timeKey];
          return renderEventWithMore(events, timeKey);
        })}
      </div>
    </div>
  );
}