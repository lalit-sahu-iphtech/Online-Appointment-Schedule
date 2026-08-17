import {
    FaSearch,
    FaRegBell,
    FaRegCommentDots,
    FaUserCircle,
    FaChevronDown,
    FaTimes
} from "react-icons/fa";

import "./calendar.css";
export default function DayView({meeting, getEventPosition, currentDate, onDelete}) {

    return (
        <div className="calendar-body">

            {/* TIME */}

            <div className="time-column">

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


            {/* GRID */}

            <div className="calendar-grid">

                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>


                {/* 08 - 09 */}

                <div className="calendar-event project-event">

                    <strong>
                        Project Kickoff
                    </strong>

                    <span>
                        08:00 - 09:00 AM
                    </span>

                </div>


                {/* 09 - 11 */}

                <div className="calendar-event workshop-event">

                    <strong>
                        Creative Workshop
                    </strong>

                    <span>
                        09:00 AM - 11:00 AM
                    </span>

                </div>


                {/* 01 - 02 */}

                <div className="calendar-event happy-event">

                    <strong>
                        🎉 Happy Hour
                    </strong>

                    <span>
                        01:00 - 02:00 PM
                    </span>

                </div>


                {/* 03 - 04 */}

                <div className="calendar-event one-event">

                    <strong>
                        One-on-one
                    </strong>

                    <span>
                        03:00 - 04:00 PM
                    </span>

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
        className="calendar-event new-meeting-event"
        style={{
            top: `${top}px`,
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

        </div>
    );
}
