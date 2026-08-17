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

import DayView from "./DayView"

import WeekView from "./WeekView";

import MonthView from "./MonthView"
// import EventDetailsModal from "./EventDetailsModal";


export default function Calendar() {

    // const[selectedEvent, setSelectedEvent] = useState(null)

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
                //    onEventClick={(eventData)=>setSelectedEvent(eventData)}

                   
                />
                }
                {/* {selectedEvent && (
                    <EventDetailsModal event={selectedEvent}onClose={() =>setSelectedEvent(null)}/>
                )} */}
            

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