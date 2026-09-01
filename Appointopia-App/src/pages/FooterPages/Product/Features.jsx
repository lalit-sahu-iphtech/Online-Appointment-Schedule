import React from 'react';
import '../Page.css'
export default function Features(){

    return(
        <div className="page-container">
            <h1>Features</h1>
            <p>Discover all the amazing features Appointopia has to offer</p>
            <div className="feature-grid">
                <div className="feature-card">
                    <h3>Smart Scheduling</h3>
                    <p>AI-powered scheduling that adapts to your prefrences.</p>

                </div>
                <div className="feature-card">
                    <h3>Team Collaboration</h3>
                    <p>Seamlessly coordinate with your team members</p>
                </div>
                <div className="feature-card">
                    <h3>Analytics Dashboard</h3>
                    <p>Track your productivity with real-time insights.</p>
                </div>
            </div>
        </div>
    )
}