import {
    FaSearch,
    FaRegBell,
    FaRegCommentDots,
    FaUserCircle,
    FaChevronDown,
    FaTimes
} from "react-icons/fa";
import "./calendar.css";
export default function MonthView({meeting, getEventPosition, currentDate, onDelete}) {

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