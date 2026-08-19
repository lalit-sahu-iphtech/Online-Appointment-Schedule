import { FaTimes } from "react-icons/fa";
import { formatDate } from "../../utils/dateUtils";
import "./calendar.css";

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

  const timeSlots = [];
  for (let i = 7; i <= 23; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hour}:00 ${ampm}`);
  }

  // Calculate total height for grid
  const totalHeight = timeSlots.length * 58;

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

        {dayEvents.map((item) => {
          const { top, height } = getEventPosition(item.startTime, item.endTime);
          const color = getEventColor(item);
          
          return (
            <div
              key={item.id}
              className="calendar-event"
              style={{
                top: `${top}px`,
                height: `${height}px`,
                background: color.bg,
                color: color.text,
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

              <strong>{item.meetingName}</strong>
              <span>{item.startTime} - {item.endTime}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}