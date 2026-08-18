import { FaTimes } from "react-icons/fa";
import { getWeekDays, formatDate, isToday } from "../../utils/dateUtils";
import "./calendar.css";

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

  const timeSlots = [];
  for (let i = 7; i <= 23; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? 'PM' : 'AM';
    timeSlots.push(`${hour}:00 ${ampm}`);
  }

  return (
    <div className="week-calendar-body">
      <div className="week-time-column">
        <div></div>
        {timeSlots.map((time, index) => (
          <div key={index}>{time}</div>
        ))}
      </div>

      {weekDays.map((day, dayIndex) => {
        const dateStr = formatDate(day);
        const dayEvents = meeting.filter(item => item.date === dateStr);
        const isTodayDate = isToday(day);

        return (
          <div key={dayIndex} className="week-day">
            <div className="week-day-header">
              <strong className={isTodayDate ? 'selected-date' : ''}>
                {day.getDate()}
              </strong>
              <span>{weekdays[dayIndex]}</span>
            </div>

            <div className="week-grid"></div>

            {dayEvents.map((item) => {
              const { top, height } = getEventPosition(item.startTime, item.endTime);
              const color = getEventColor(item);
              
              return (
                <div
                  key={item.id}
                  className="week-event"
                  style={{
                    top: `${top + 62}px`,
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
                  <span>{item.startTime}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}