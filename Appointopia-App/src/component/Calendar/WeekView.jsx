import {
    FaSearch,
    FaRegBell,
    FaRegCommentDots,
    FaUserCircle,
    FaChevronDown,
    FaTimes
} from "react-icons/fa";
import "./calendar.css";
 export default function WeekView({meeting, getEventPosition, currentDate, onDelete}) {

    return (
        <div className="week-calendar-body">

            {/* TIME COLUMN */}

            <div className="week-time-column">

                <div></div>
                <div>07:00 AM</div>
                <div>08:00 AM</div>
                <div>09:00 AM</div>
                <div>10:00 AM</div>
                <div>11:00 AM</div>
                <div>12:00 PM</div>
                <div>01:00 PM</div>
                <div>02:00 PM</div>
                <div>03:00 PM</div>
                <div>04:00 PM</div>
                <div>05:00 PM</div>
                <div>06:00 PM</div>
                <div>07:00 PM</div>
                <div>08:00 PM</div>
                <div>09:00 PM</div>
                <div>10:00 PM</div>
                <div>11:00 PM</div>

            </div>


            {/* MONDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong className="selected-date">10</strong>
                    <span>MON</span>
                </div>

                <div className="week-grid"></div>

                <div className="week-event project-week-event">
                    <strong>Project Kickoff</strong>
                    <span>08:00 - 09:00 AM</span>
                </div>

                <div className="week-event one-week-event">
                    <strong>One-on-one</strong>
                    <span>01:00 - 02:00 PM</span>
                </div>

                {meeting
                    .filter((item) => item.date === currentDate)
                    .map((item) => {

                        const { top, height } = getEventPosition(
                            item.startTime,
                            item.endTime
                        );

                        return (
                            <div
                                key={item.id}
                                className="week-event new-meeting-event"
                                style={{
                                    top: `${top + 62}px`,
                                    height: `${height}px`
                                }}
                            >
                                <button
                                    type="button"
                                    className="delete-meeting-btn"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <FaTimes />
                                </button>

                                <strong>
                                    {item.meetingName}
                                </strong>

                                <span>
                                    {item.startTime} - {item.endTime}
                                </span>
                            </div>
                        );
                    })}

            </div>


            {/* TUESDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>11</strong>
                    <span>TUE</span>
                </div>

                <div className="week-grid"></div>

                <div className="week-event happy-week-event">
                    <strong>🎉 Happy Hour</strong>
                    <span>11:00 AM - 12:00 PM</span>
                </div>

                <div className="week-event one-week-event second-one">
                    <strong>One-on-one</strong>
                    <span>02:00 - 03:00 PM</span>
                </div>

            </div>


            {/* WEDNESDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>12</strong>
                    <span>WED</span>
                </div>

                <div className="week-grid"></div>

            </div>


            {/* THURSDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>13</strong>
                    <span>THU</span>
                </div>

                <div className="week-grid"></div>

                <div className="week-event one-week-event">
                    <strong>One-on-one</strong>
                    <span>01:00 - 02:00 PM</span>
                </div>

            </div>


            {/* FRIDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>14</strong>
                    <span>FRI</span>
                </div>

                <div className="week-grid"></div>

                <div className="week-event workshop-week-event">
                    <strong>Creative Workshop</strong>
                    <span>09:00 AM - 12:00 PM</span>
                </div>

                <div className="week-event weekly-week-event">
                    <strong>Weekly Meeting</strong>
                    <span>01:00 - 02:00 PM</span>
                </div>

            </div>


            {/* SATURDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>15</strong>
                    <span>SAT</span>
                </div>

                <div className="week-grid"></div>

            </div>


            {/* SUNDAY */}

            <div className="week-day">

                <div className="week-day-header">
                    <strong>16</strong>
                    <span>SUN</span>
                </div>

                <div className="week-grid"></div>

            </div>

        </div>
    );
}
