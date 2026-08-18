import { FaTimes } from "react-icons/fa";
import { getMonthDays, formatDate, isToday } from "../../utils/dateUtils";
import "./calendar.css";

export default function MonthView({ 
  meeting, 
  getEventColor,
  currentDate, 
  onDelete, 
  onEventClick 
}) {
  
  const monthDays = getMonthDays(currentDate);
  const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const weeks = [];
  for (let i = 0; i < monthDays.length; i += 7) {
    weeks.push(monthDays.slice(i, i + 7));
  }

  return (
    <div className="month-calendar">
      <div className="month-weekdays">
        {weekdays.map((day, index) => (
          <div key={index} className={index === 0 ? 'active-weekday' : ''}>
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="month-row">
          {week.map((day, dayIndex) => {
            const dateStr = formatDate(day.date);
            const dayEvents = meeting.filter(item => item.date === dateStr);
            const isTodayDate = isToday(day.date);
            const isCurrentMonth = day.isCurrentMonth;

            return (
              <div 
                key={dayIndex} 
                className={`month-day ${!isCurrentMonth ? 'previous' : ''}`}
              >
                <span className={isTodayDate ? 'month-selected-date' : ''}>
                  {day.date.getDate()}
                </span>
                
                {dayEvents.slice(0, 3).map((item) => {
                  const color = getEventColor(item);
                  
                  return (
                    <div
                      key={item.id}
                      className="month-event"
                      style={{
                        background: color.bg,
                        color: color.text,
                      }}
                      onClick={() => onEventClick && onEventClick(item)}
                    >
                      <button
                        type="button"
                        className="delete-meeting-btn month-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(item.id);
                        }}
                      >
                        <FaTimes />
                      </button>
                      <small>{item.startTime}</small>
                      {item.meetingName}
                    </div>
                  );
                })}
                
                {dayEvents.length > 3 && (
                  <div className="month-event" style={{ 
                    background: 'transparent', 
                    color: '#8555d5',
                    fontSize: '8px',
                    padding: '2px 6px',
                    marginTop: '2px'
                  }}>
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}