// src/pages/PostLoginHomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PostLoginHomePage = () => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome to AgroVision Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Animals</h2>
                        <p>Manage your livestock inventory and track animal health.</p>
                        <div className="card-actions justify-end">
                            <Link to="/animals" className="btn btn-primary">View Animals</Link>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Crops</h2>
                        <p>Monitor your crop growth and manage planting schedules.</p>
                        <div className="card-actions justify-end">
                            <Link to="/crops" className="btn btn-primary">View Crops</Link>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Equipment</h2>
                        <p>Track equipment maintenance and usage.</p>
                        <div className="card-actions justify-end">
                            <Link to="/equipment" className="btn btn-primary">View Equipment</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostLoginHomePage;