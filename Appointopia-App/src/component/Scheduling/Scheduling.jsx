// src/component/Scheduling/Scheduling.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import schedule1 from "../../assets/images/schedule1.png";
import schedule2 from "../../assets/images/schedule2.png";
import dotImg from "../../assets/images/dotImg.png";
import { FaCheck, FaExternalLinkAlt, FaCopy, FaCheckCircle } from "react-icons/fa";
import A1 from "../../assets/hero/A1.jpg";
import B1 from "../../assets/hero/B1.jpg";
import B2 from "../../assets/hero/B2.png";
import "./scheduling.css";

export default function Scheduling() {
  const navigate = useNavigate();
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareLink] = useState("https://appointopia.com/share/event-123");

  // Handle Learn More button click
  const handleLearnMore = (section) => {
    console.log(`Learn More clicked for: ${section}`);
    // Navigate to features page or show more info
    navigate('/features');
  };

  // Handle Copy Link functionality
  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(true);
      console.log('Link copied to clipboard:', link);
      
      // Show success state
      setTimeout(() => {
        setCopySuccess(false);
      }, 3000);
    } catch (err) {
      console.error(' Failed to copy link:', err);
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        console.log(' Link copied using fallback method');
        setTimeout(() => {
          setCopySuccess(false);
        }, 3000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        alert('Failed to copy link. Please copy it manually.');
      }
      document.body.removeChild(textarea);
    }
  };

  // Handle Share button click
  const handleShare = async () => {
    console.log(' Share button clicked');
    console.log(' Sharing link:', shareLink);
    
    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Appointopia - Share your schedule',
          text: 'Check out my schedule on Appointopia!',
          url: shareLink,
        });
        console.log('Shared successfully using Web Share API');
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(' Error sharing:', error);
          // Fallback - copy link to clipboard
          await handleCopyLink(shareLink);
        } else {
          console.log('⏹ Share cancelled by user');
        }
      }
    } else {
      // Fallback - copy link to clipboard
      await handleCopyLink(shareLink);
    }
  };

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
          <button 
            className="learn-more-btn"
            onClick={() => handleLearnMore('Smarter Scheduling')}
          >
            Learn more
          </button>
        </div>

        {/* RIGHT ILLUSTRATION */}
        <div className="smart-visual">
          <img src={dotImg} alt="" className="smart-dots" />
          
          <div className="meeting-card">
            <div className="meeting-date">17</div>
            <div className="meeting-row weekly">
              <span>11:00 AM</span>
              <strong>Weekly Meeting</strong>
            </div>
            <div className="meeting-row monthly">
              <span>03:00 PM</span>
              <strong>Monthly Review</strong>
            </div>
          </div>

          <img src={schedule1} alt="Schedule" className="smart-person" />
          
          <div className="automatically">Automatically</div>
          
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
          <img src={dotImg} alt="" className="share-dots" />
          <img src={schedule2} alt="Share schedule" className="share-person" />
          <img src={B1} alt="" className="profile profile-one" />
          <img src={A1} alt="" className="profile profile-two" />
          <img src={B2} alt="" className="profile profile-three" />

          <div className="share-card">
            <h4>Share with everyone</h4>
            <div className="share-card-bottom">
              <a href={shareLink} target="_blank" rel="noopener noreferrer">
                {shareLink}
              </a>
              <button 
                className="copy-link"
                onClick={() => handleCopyLink(shareLink)}
                title="Copy link"
              >
                {copySuccess ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaCheckCircle style={{ color: '#4CAF50' }} /> Copied!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FaCopy /> Copy Link
                  </span>
                )}
              </button>
              <button 
                className="share-btn"
                onClick={handleShare}
              >
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
          <button 
            className="learn-more-btn"
            onClick={() => handleLearnMore('Share Schedule')}
          >
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}