import Calendar from "../../component/Calendar/Calendar";
import Sidebar from "../../component/Sidebar/Sidebar";

import "./calendarPage.css"
export default function CalendarPage(){
    return(

        <div className="calendar-page">

            <Sidebar/>

            <div className="calendar-main">

                <main className="calendar-content">
                    <Calendar/>
                </main>
            </div>
        </div>
    )
}