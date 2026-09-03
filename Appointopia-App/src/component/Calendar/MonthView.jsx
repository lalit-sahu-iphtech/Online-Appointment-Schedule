// src/component/Calendar/MonthView.jsx
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaChevronDown, FaClock } from "react-icons/fa";
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

  const [expandedDate, setExpandedDate] = useState(null);
  const [popoverPos, setPopoverPos] = useState(null);
  const popoverRef = useRef(null); 

  const dayCellRefs = useRef({});

  const openPopover = (dateStr) => {
    const cell = dayCellRefs.current[dateStr];
    if (!cell) return;
    const rect = cell.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 420;
    const padding = 12;
    
    let top, left;
    const spaceBelow = window.innerHeight - rect.bottom - padding;
    const spaceAbove = rect.top - padding;
    
    if (spaceBelow >= popoverHeight) {
      top = rect.bottom + padding;
    } 
    else if (spaceAbove >= popoverHeight) {
      top = rect.top - popoverHeight - padding;
    } 
    else {
      top = Math.max(padding, (window.innerHeight - popoverHeight) / 2);
    }
    
    const cellCenter = rect.left + rect.width / 2;
    let preferredLeft = cellCenter - popoverWidth / 2;
    left = Math.max(padding, Math.min(preferredLeft, window.innerWidth - popoverWidth - padding));
    
    setPopoverPos({ top, left });
    setExpandedDate(dateStr);
  };

  const closePopover = () => {
    setExpandedDate(null);
    setPopoverPos(null);
  };

  //  Fixed scroll detection - properly handles scroll inside popover
  useEffect(() => {
    if (!expandedDate) return;
    
    const handleKey = (e) => e.key === "Escape" && closePopover();
    
    const handleScroll = (e) => {
      //  Get the element that was scrolled
      const target = e.target;
      
      // Check if popover exists and if scroll happened inside it
      const popoverElement = popoverRef.current;
      
      // If popover doesn't exist yet, close it
      if (!popoverElement) {
        closePopover();
        return;
      }
      
      //  Check if the scroll target is the popover itself or inside it
      let isInsidePopover = false;
      
      // If the scroll target is the popover element itself
      if (target === popoverElement) {
        isInsidePopover = true;
      }
      // If the scroll target is a child of the popover
      else if (target && typeof target.closest === 'function') {
        isInsidePopover = target.closest('.month-popover') !== null;
      }
      // If scroll target is document/window
      else if (target === document || target === window) {
        isInsidePopover = false;
      }
      
      //  Only close if scroll happened OUTSIDE the popover
      if (!isInsidePopover) {
        closePopover();
      }
    };
    
    const handleResize = () => closePopover();
    
    window.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [expandedDate]);

  // Group events by date
  const eventsByDate = {};
  meeting.forEach(item => {
    const dateStr = formatDate(new Date(item.date));
    if (!eventsByDate[dateStr]) {
      eventsByDate[dateStr] = [];
    }
    eventsByDate[dateStr].push(item);
  });

  const expandedEvents = expandedDate ? (eventsByDate[expandedDate] || []) : [];

  const getInitial = (name) => (name || "?").trim().charAt(0).toUpperCase();

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
            const dayEvents = eventsByDate[dateStr] || [];
            const isTodayDate = isToday(day.date);
            const isCurrentMonth = day.isCurrentMonth;

            const visibleEvents = dayEvents.slice(0, 3);
            const hiddenCount = dayEvents.length - 3;

            return (
              <div 
                key={dayIndex} 
                ref={(el) => (dayCellRefs.current[dateStr] = el)}
                className={`month-day ${!isCurrentMonth ? 'previous' : ''}`}
              >
                <span className={isTodayDate ? 'month-selected-date' : ''}>
                  {day.date.getDate()}
                </span>
                
                {visibleEvents.map((item) => {
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
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.meetingName}
                      </span>
                    </div>
                  );
                })}
                
                {dayEvents.length > 3 && (
                  <div 
                    className="month-show-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPopover(dateStr);
                    }}
                  >
                    <FaChevronDown className="show-more-icon" />
                    <span>+{hiddenCount} more</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {expandedDate && popoverPos && createPortal(
        <>
          <div className="month-popover-backdrop" onClick={closePopover} />
          <div
            ref={popoverRef} 
            className="month-popover"
            style={{ 
              top: `${popoverPos.top}px`, 
              left: `${popoverPos.left}px`,
              maxHeight: '420px',
              overflowY: 'auto'
            }}
          >
            <div className="month-popover-header">
              <span>{expandedEvents.length} meetings on {expandedDate}</span>
              <button className="month-popover-close" onClick={closePopover}>
                <FaTimes />
              </button>
            </div>

            {(() => {
              const n = expandedEvents.length;
              const PEEK_STEP = 30;
              const CARD_STEP = 68;
              const CARD_HEIGHT = 58;

              const collapsedStackHeight = (n - 1) * PEEK_STEP + CARD_HEIGHT;
              const expandedStackHeight = (n - 1) * CARD_STEP + CARD_HEIGHT;

              return (
                <div
                  className="month-popover-stack"
                  style={{
                    '--collapsed-h': `${collapsedStackHeight}px`,
                    '--expanded-h': `${expandedStackHeight}px`,
                  }}
                >
                  {expandedEvents.map((item, index) => {
                    const color = getEventColor(item);
                    const reversedIndex = n - 1 - index;
                    const isFront = reversedIndex <= 1;
                    const blur = isFront ? 0 : Math.min((reversedIndex - 1) * 2, 6);
                    const opacity = isFront ? 1 : Math.max(1 - (reversedIndex - 1) * 0.22, 0.35);
                    const scale = isFront ? 1 : Math.max(1 - (reversedIndex - 1) * 0.025, 0.92);

                    return (
                      <div
                        key={item.id}
                        className="month-popover-card"
                        style={{
                          zIndex: index + 1,
                          '--top-collapsed': `${index * PEEK_STEP}px`,
                          '--top-expanded': `${index * CARD_STEP}px`,
                          '--blur-collapsed': `${blur}px`,
                          '--opacity-collapsed': opacity,
                          '--scale-collapsed': scale,
                        }}
                        onClick={() => {
                          closePopover();
                          onEventClick && onEventClick(item);
                        }}
                      >
                        <div
                          className="month-popover-avatar"
                          style={{ background: color.bg, color: color.text }}
                        >
                          {getInitial(item.meetingName)}
                        </div>
                        <div className="month-popover-info">
                          <strong>{item.meetingName}</strong>
                          <span>
                            <FaClock className="month-popover-clock" />
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="month-popover-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </>,
        document.body
      )}
    </div>
  );
}