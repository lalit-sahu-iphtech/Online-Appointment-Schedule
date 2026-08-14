
import schedule1 from "../../assets/images/schedule1.png"
import schedule2 from "../../assets/images/schedule2.png"
import dotImg from "../../assets/images/dotImg.png"

import{FaCheck, FaExternalLinkAlt,} from "react-icons/fa";

import A1 from "../../assets/hero/A1.jpg"
import B1 from "../../assets/hero/B1.jpg"
import B2 from "../../assets/hero/B2.png"

 

import "./scheduling.css"

export default function Scheduling() {
    return (
      <section className="scheduling-section">
  
        {/* =================================================
            SMARTER SCHEDULING
        ================================================= */}
  
        <div className="scheduling-container">
  
          {/* LEFT CONTENT */}
  
          <div className="scheduling-text">
  
            <h2>
              <span>Smarter</span> scheduling for
              <br />
              your work
            </h2>
  
            <p>
              Smarter scheduling for work involves employing
              <br />
              effective strategies
            </p>
  
            <button className="learn-more-btn">
              Learn more
            </button>
  
          </div>
  
  
          {/* RIGHT ILLUSTRATION */}
  
          <div className="smart-visual">
  
            {/* DOTTED IMAGE */}
  
            <img
              src={dotImg}
              alt=""
              className="smart-dots"
            />
  
  
            {/* MEETING CARD */}
  
            <div className="meeting-card">
  
              <div className="meeting-date">
                17
              </div>
  
              <div className="meeting-row weekly">
  
                <span>11:00 AM</span>
  
                <strong>
                  Weekly Meeting
                </strong>
  
              </div>
  
              <div className="meeting-row monthly">
  
                <span>03:00 PM</span>
  
                <strong>
                  Monthly Review
                </strong>
  
              </div>
  
            </div>
  
  
            {/* PERSON */}
  
            <img
              src={schedule1}
              alt="Schedule"
              className="smart-person"
            />
  
  
            {/* AUTOMATICALLY */}
  
            <div className="automatically">
              Automatically
            </div>
  
  
            {/* CHECK */}
  
            <div className="smart-check">
              <FaCheck />
            </div>
  
          </div>
  
        </div>
  
  
        {/* =================================================
            SHARE YOUR SCHEDULE
        ================================================= */}
  
        <div className="scheduling-container share-container">
  
          {/* LEFT ILLUSTRATION */}
  
          <div className="share-visual">
  
            {/* DOTS */}
  
            <img
              src={dotImg}
              alt=""
              className="share-dots"
            />
  
  
            {/* PERSON */}
  
            <img
              src={schedule2}
              alt="Share schedule"
              className="share-person"
            />
  
  
            {/* PROFILE 1 */}
  
            <img
              src={B1}
              alt=""
              className="profile profile-one"
            />
  
  
            {/* PROFILE 2 */}
  
            <img
              src={A1}
              alt=""
              className="profile profile-two"
            />
  
  
            {/* PROFILE 3 */}
  
            <img
              src={B2}
              alt=""
              className="profile profile-three"
            />
  
  
            {/* SHARE CARD */}
  
            <div className="share-card">
  
              <h4>
                Share with everyone
              </h4>
  
              <div className="share-card-bottom">
  
                <a href="#">
                  Link.com
                </a>
  
                <button className="copy-link">
                  Copy Link
                </button>
  
                <button className="share-btn">
                  Share
                  <FaExternalLinkAlt />
                </button>
  
              </div>
  
            </div>
  
          </div>
  
  
          {/* RIGHT CONTENT */}
  
          <div className="scheduling-text share-text">
  
            <h2>
              <span>Share</span> your schedule
              <br />
              with everyone
            </h2>
  
            <p>
              Sharing the event schedule allows attendees to be well-informed
              <br />
              about the event's agenda, timing
            </p>
  
            <button className="learn-more-btn">
              Learn more
            </button>
  
          </div>
  
        </div>
  
      </section>
    );
  }