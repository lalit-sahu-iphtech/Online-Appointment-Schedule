import { useState } from "react";
import {
    FaSearch,
    FaRegBell,
    FaRegCommentDots,
    FaUserCircle,
    FaChevronDown,
    FaTimes
} from "react-icons/fa";

import AddMeetingModal from "./AddMeetingModal";

import "./calendar.css";


/* =====================================================
   DAY VIEW
===================================================== */

function DayView({meeting, getEventPosition, currentDate, onDelete}) {

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


/* =====================================================
   WEEK VIEW
===================================================== */

function WeekView({meeting, getEventPosition, currentDate, onDelete}) {

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


/* =====================================================
   MONTH VIEW
===================================================== */

function MonthView({meeting, getEventPosition, currentDate, onDelete}) {

    return (
        <div className="month-calendar">

            {/* DAYS */}

            <div className="month-weekdays">

                <div className="active-weekday">MON</div>
                <div>TUE</div>
                <div>WED</div>
                <div>THU</div>
                <div>FRI</div>
                <div>SAT</div>
                <div>SUN</div>

            </div>


            {/* FIRST WEEK */}

            <div className="month-row">

                <div className="month-day previous">
                    26
                </div>

                <div className="month-day previous">
                    27
                </div>

                <div className="month-day previous">
                    28
                </div>

                <div className="month-day previous">
                    29
                </div>

                <div className="month-day">
                    <span>30</span>

                    <div className="month-event gray-event">
                        <small>02:00 PM</small>
                        Weekly Meeting
                    </div>
                </div>

                <div className="month-day">
                    01
                </div>

                <div className="month-day">
                    02
                </div>

            </div>


            {/* SECOND WEEK */}

            <div className="month-row">

                <div className="month-day">

                    <span>03</span>

                    <div className="month-event gray-event">
                        <small>08:00 AM</small>
                        Project Kickoff
                    </div>

                </div>

                <div className="month-day">
                    04
                </div>

                <div className="month-day">

                    <span>05</span>

                    <div className="month-event gray-event">
                        <small>08:00 AM</small>
                        Sync Design
                    </div>

                </div>

                <div className="month-day">
                    06
                </div>

                <div className="month-day">

                    <span>07</span>

                    <div className="month-event gray-event">
                        <small>02:00 PM</small>
                        Weekly Meeting
                    </div>

                </div>

                <div className="month-day">
                    08
                </div>

                <div className="month-day">

                    <span>09</span>

                    <div className="month-event birthday-event">
                        Anna's Birthday
                    </div>

                </div>

            </div>


            {/* THIRD WEEK */}

            <div className="month-row">

                <div className="month-day">

                    <span className="month-selected-date">
                        10
                    </span>

                    <div className="month-event gray-event">
                        <small>08:00 AM</small>
                        Project Kickoff
                    </div>

                    <div className="month-event cyan-event">
                        <small>01:00 PM</small>
                        One-on-One
                    </div>

                    {meeting
                        .filter((item) => item.date === currentDate)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="month-event new-meeting-event"
                            >
                                <button
                                    type="button"
                                    className="delete-meeting-btn month-delete-btn"
                                    onClick={() => onDelete(item.id)}
                                >
                                    <FaTimes />
                                </button>

                                <strong>
                                    {item.meetingName}
                                </strong>

                                <span>
                                    {item.startTime}
                                </span>
                            </div>
                        ))}

                </div>


                <div className="month-day">

                    <span>11</span>

                    <div className="month-event orange-event">
                        <small>11:00 AM</small>
                        🎉 Happy Hour
                    </div>

                    <div className="month-event cyan-event">
                        <small>02:00 PM</small>
                        One-on-One
                    </div>

                </div>


                <div className="month-day">
                    12
                </div>


                <div className="month-day">

                    <span>13</span>

                    <div className="month-event cyan-event">
                        <small>01:00 PM</small>
                        One-on-One
                    </div>

                </div>


                <div className="month-day">

                    <span>14</span>

                    <div className="month-event teal-event">
                        <small>09:00 PM</small>
                        Creative Workshop
                    </div>

                    <div className="month-event purple-event">
                        <small>01:00 PM</small>
                        Weekly Meeting
                    </div>

                </div>


                <div className="month-day">
                    15
                </div>

                <div className="month-day">
                    16
                </div>

            </div>


            {/* FOURTH WEEK */}

            <div className="month-row">

                <div className="month-day">
                    17
                </div>

                <div className="month-day">
                    18
                </div>

                <div className="month-day">
                    19
                </div>

                <div className="month-day">
                    20
                </div>

                <div className="month-day">

                    <span>21</span>

                    <div className="month-event purple-event">
                        <small>01:00 PM</small>
                        Weekly Meeting
                    </div>

                </div>

                <div className="month-day">
                    22
                </div>

                <div className="month-day">
                    23
                </div>

            </div>


            {/* FIFTH WEEK */}

            <div className="month-row">

                <div className="month-day">
                    24
                </div>

                <div className="month-day">
                    25
                </div>

                <div className="month-day">

                    <span>26</span>

                    <div className="month-event teal-event">
                        <small>01:00 PM</small>
                        Creative Workshop
                    </div>

                </div>

                <div className="month-day">
                    27
                </div>

                <div className="month-day">

                    <span>28</span>

                    <div className="month-event purple-event">
                        <small>01:00 PM</small>
                        Weekly Meeting
                    </div>

                </div>

                <div className="month-day">
                    29
                </div>

                <div className="month-day">
                    30
                </div>

            </div>


            {/* SIXTH WEEK */}

            <div className="month-row">

                <div className="month-day">

                    <span>31</span>

                    <div className="month-event orange-event">
                        Tom's Birthday
                    </div>

                </div>

                <div className="month-day previous">
                    01
                </div>

                <div className="month-day previous">
                    02
                </div>

                <div className="month-day previous">
                    03
                </div>

                <div className="month-day previous">
                    04
                </div>

                <div className="month-day previous">
                    05
                </div>

                <div className="month-day previous">
                    06
                </div>

            </div>

        </div>
    );
}


/* =====================================================
   MAIN CALENDAR
===================================================== */

export default function Calendar() {

    const [view, setView] = useState("day");

    // Calendar header abhi "Mon, July 10, 2023" dikhata hai,
    // isliye currentDate ko usi date se match rakha hai (YYYY-MM-DD),
    // taaki AddMeetingModal ke date input se match ho sake.
    const [currentDate, setCurrentDate] = useState("2023-07-10");

    const[showMeetingModal, setShowMeetingModal] = useState(false);
    const[meeting, setMeeting] = useState([]);

    // Meeting ko id se delete karta hai
    const deleteMeeting = (id) => {
        setMeeting(meeting.filter((item) => item.id !== id));
    };

    const getEventPosition = (startTime, endTime) => {

        const [startHour, startMinute] =
            startTime.split(":").map(Number);

        const [endHour, endMinute] =
            endTime.split(":").map(Number);

        // Calendar 07:00 AM se start hota hai
        const calendarStartHour = 7;

        const startMinutes =
            (startHour * 60 + startMinute) -
            (calendarStartHour * 60);

        const endMinutes =
            (endHour * 60 + endMinute) -
            (calendarStartHour * 60);

        // 1 hour = 58px
        const top = (startMinutes / 60) * 58;

        const height =
            ((endMinutes - startMinutes) / 60) * 58;

        return {
            top,
            height
        };
    };



    return (
        <>

            {/* =====================================================
               TOP BAR
            ===================================================== */}

            <div className="calendar-topbar">

                <h1>Calendar</h1>


                <div className="topbar-right">

                    <button className="create-btn"
                    onClick={()=>setShowMeetingModal(true)}
                    >

                        <span>+</span>

                        Create

                    </button>


                    <div className="topbar-icons">

                        <button className="icon-btn">
                            <FaSearch />
                        </button>

                        <button className="icon-btn">
                            <FaRegBell />
                        </button>

                        <button className="icon-btn">
                            <FaRegCommentDots />
                        </button>


                        <div className="avatar-wrap">

                            <FaUserCircle className="avatar-icon" />

                            <FaChevronDown className="avatar-chevron" />

                        </div>

                    </div>

                </div>

            </div>


            {/* =====================================================
               CALENDAR
            ===================================================== */}

            <div className="calendar-container">


                {/* HEADER */}

                <div className="calendar-header">


                    <div className="calendar-date">

                        <h2>
                            {view === "day"
                                ? "Mon, July 10, 2023"
                                : "July, 2023"
                            }
                        </h2>


                        <button className="arrow-btn">
                            ‹
                        </button>

                        <button className="arrow-btn">
                            ›
                        </button>

                        <button className="today-btn">
                            Today
                        </button>

                    </div>


                    {/* VIEW BUTTONS */}

                    <div className="calendar-view">

                        <button
                            className={
                                view === "day"
                                    ? "view-active"
                                    : ""
                            }
                            onClick={() => setView("day")}
                        >
                            Day
                        </button>


                        <button
                            className={
                                view === "week"
                                    ? "view-active"
                                    : ""
                            }
                            onClick={() => setView("week")}
                        >
                            Week
                        </button>


                        <button
                            className={
                                view === "month"
                                    ? "view-active"
                                    : ""
                            }
                            onClick={() => setView("month")}
                        >
                            Month
                        </button>

                    </div>

                </div>


                {/* =====================================================
                   CHANGE VIEW
                ===================================================== */}

                {view === "day" && <DayView 
                   meeting={meeting}
                   getEventPosition={getEventPosition}
                   currentDate={currentDate}
                   onDelete={deleteMeeting}
                    />}

                {view === "week" && <WeekView 
                meeting={meeting}
                getEventPosition={getEventPosition}
                currentDate={currentDate}
                onDelete={deleteMeeting}
                />}

                {view === "month" && <MonthView 
                meeting={meeting}
                getEventPosition={getEventPosition}
                currentDate={currentDate}
                onDelete={deleteMeeting}
                />}


            </div>

            {showMeetingModal && (
                <AddMeetingModal onClose={()=>setShowMeetingModal(false)}
                defaultDate={currentDate}
                onSave={(newMeeetingData)=>{
                    const newMeeting = {
                        ...newMeeetingData, id:Date.now()
                    };
                    setMeeting([
                        ...meeting, newMeeting
                    ])
                    setShowMeetingModal(false);
                }}
                />
            )}



        </>
    );
}