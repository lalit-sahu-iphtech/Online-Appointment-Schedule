import { useState } from "react";
import{FaChevronDown, FaChevronUp} from "react-icons/fa"
import faqImg from "../../assets/images/faqImg.png"

import "./faq.css"
export default function FAQ(){

    const [activeIndex, setActiveIndex] = useState(1);

const faqData = [

    {
        question : "What is a schedule tool, and howw does it work?",
        answer:"A schedule tool helps you organize appointments, meetings,deadlines, and events in one place. It allows you to manage your schedule efficiently and stay organized"
    },
    {
        question : "Can  I sync the schedule tool with my existing calendar ?",
        answer : "Yes, many schedule tools offer integration with popular calendar apps like Google Calendar, Outlook, or Apple Calendar. This allows users to sync their schedules across different devices and stay up-to-data with their commitments."
    },
    {
        question: "Can I share my schedule with others?",
        answer:
          "Yes, you can share your schedule with other people so they can easily see your availability, events, and meeting timings.",
      },
      {
        question: "Is my data safe and secure within the schedule tool?",
        answer:
          "Yes, schedule tools generally use security measures to protect your personal information, schedules, and other important data.",
      },
];

const handleToggle = (index)=>{
    setActiveIndex(activeIndex === index ? null : index);
}
    return (
        <section className="faq-section">

            <div className="faq-left">
                <div className="faq-rectangle"></div>
                <img src={faqImg} alt=""className="faq-image" />
                <div className="faq-purple-shape"></div>
            </div>

            <div className="faq-right">
                <h2>FAQ?</h2>

                <div className="faq-list">
                    {faqData.map((item, index)=>{
                        const isOpen = activeIndex === index;

                        return(
                            <div className={`faq-item ${isOpen ? "active" : ""}`} key={index}>

                                <button
                                className="faq-question"
                                onClick={()=>handleToggle(index)}
                                >
                                <span>{item.question}</span>

                                {isOpen ? (
                                    <FaChevronUp/>
                                ) : (
                                    <FaChevronDown/>
                                )}
                                </button>

                                {isOpen && (
                                    <div className="faq-answer">
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>


        </section>
    )
}