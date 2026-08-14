
import {
    FaRegCalendarCheck,
    FaRegBuilding,
    FaRegClock,
  } from "react-icons/fa";

  import { FaRegCircleUser } from "react-icons/fa6";
  import { PiBuildingApartment } from "react-icons/pi";
  import { LuClock4 } from "react-icons/lu";
  import "./statistics.css"

export default function Statistics(){

    const statistics = [
        {
            id : 1,
            icon : <FaRegCircleUser />,
            number : "1+M",
            title:"New Users",
            className:"users-card"
        },
        {
            id : 2,
            icon : <FaRegCalendarCheck/>,
            number : "2+M",
            title:"Metting Schedule",
            className:"meeting-card-st"
        },
        {
            id : 3,
            icon : <PiBuildingApartment />,
            number : "200+",
            title:"Trusted businesses",
            className:"business-card"
        },
        {
            id : 4,
            icon : <LuClock4 />,
            number : "40%",
            title:"Save Time",
            className:"time-card"
        },

    ]
     return(

        <section className="statistics">
            <div className="statistics-container">
                {statistics.map((item)=>(
                    <div className={`stat-card ${item.className}`}
                    key={item.id} 
                    >
                        <div className="stat-icon">
                            {item.icon}
                        </div>
                        <h2>{item.number}</h2>
                        <p>{item.title}</p>

                    </div>
                ))}
            </div>

        </section>
     )
}