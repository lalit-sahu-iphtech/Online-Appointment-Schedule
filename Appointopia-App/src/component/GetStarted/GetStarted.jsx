import profile1 from "../../assets/hero/A1.jpg"
import profile2 from "../../assets/hero/j1.jpg"
import profile3 from "../../assets/hero/B1.jpg"

import { Link } from "react-router-dom";

import "./getstarted.css";

export default function GetStarted(){
    

    return(
        <section className="get-started">

            <div className="cta-top-shape"></div>
            <div className="cta-bottom-shape"></div>

             <img src={profile1} alt="" className="cta-profile cta-profile-one"/>
             <img src={profile2} alt="" className="cta-profile cta-profile-two"/>
             <img src={profile3} alt="" className="cta-profile cta-profile-three"/>

             <div className="get-started-content">
                <h2>Get started</h2>

                <p>
                    Utilize digital calendars or scheduling apps to keep track of your 
                    appointments, deadlines, and events. These tools often offer reminders
                    and can sync across multiple devices, ensuring you stay on top of your schedule
                </p>

                <Link to="/signup">
                <button className="cta-signup-btn">Sign up</button>
                </Link>
             
             </div>



        </section>
    )
}