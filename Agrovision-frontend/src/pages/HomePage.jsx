// src/pages/HomePage.jsx
import React from 'react';

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to AgroVision</h1>
            <p>Your comprehensive solution for agricultural management and monitoring.</p>

            <div className="features-section">
                <h2>Key Features</h2>
                <ul>
                    <li>Animal tracking and management</li>
                    <li>Crop monitoring</li>
                    <li>Equipment maintenance</li>
                    <li>Data analytics</li>
                </ul>
            </div>

            <div className="get-started">
                <h2>Get Started</h2>
                <p>Navigate to the Animals section to manage your livestock inventory.</p>
            </div>
        </div>
    );
};

export default HomePage;