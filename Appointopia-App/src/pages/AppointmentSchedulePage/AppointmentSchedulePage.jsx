import AppointmentSchedule from "../../component/AppointmentSchedule/AppointmentSchedule";
import Sidebar from "../../component/Sidebar/Sidebar";

import "./appointmentSchedulePage.css"
export default function AppointmentSchedulePage(){
    return(

        <div className="appointment-page">

        <Sidebar/>

        <div className="appointment-main">

            <main className="appointment-content">
            <AppointmentSchedule/>
            </main>
        </div>
    </div>

        
    )
}