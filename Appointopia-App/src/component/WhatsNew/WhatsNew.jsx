import blog1 from "../../assets/images/newFirst.png";
import blog2 from "../../assets/images/newSec.png";
import blog3 from "../../assets/images/newThird.png";

import "./whatsnew.css"
export default function WhatsNew(){

    const blogData = [

        {
            id : 1,
            image:blog1,
            title:"Introducing the Ultimate Schedule Tool for Your Bussiness",
            date : "Dec 22, 2022"
        },

        {
            id:2,
            image : blog2,
            title:"Stay Organized: Introduing the Latest Schedule tool",
            date : "Dec 22, 2022",
        },

        {
            id : 3, 
            image : blog3,
            title:"Boost Productivity with the Innovative Schedule Tool of the year",
            date : "Dec 22, 2022",
        }
    ]

    return(
        <section className="whats-new">

            <div className="whats-new-container">
                <h2>What's new?</h2>

                <div className="blog-grid">
                    {
                        blogData.map((blog)=>(
                            <div className="blog-card" key={blog.id}>

                                <div className="blog-image">
                                    <img src={blog.image} alt="" />
                                </div>

                                <div className="blog-content">
                                    <h3>{blog.title}</h3>
                                    <p>{blog.date}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

        </section>
    )
}