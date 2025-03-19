// src/pages/PreLoginHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PreLoginHomePage = () => {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">AgroVision</h1>
                    <p className="py-6">Your comprehensive solution for agricultural management and monitoring. Track animals, monitor crops, and optimize your farm operations.</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-outline">Register</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreLoginHomePage;