import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-base-100 shadow-xl rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                    
                    <div className="card bg-base-200 p-4 mb-6">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.username}!</h2>
                        <p className="text-base-content/70">
                            Email: {user?.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="card bg-primary text-primary-content p-6">
                            <h3 className="card-title">Animals</h3>
                            <p>Manage your livestock</p>
                            <div className="card-actions justify-end mt-4">
                                <Link to="/dashboard/animals" className="btn">
                                    View Animals
                                </Link>
                            </div>
                        </div>

                        <div className="card bg-secondary text-secondary-content p-6">
                            <h3 className="card-title">Reports</h3>
                            <p>View analytics and reports</p>
                            <div className="card-actions justify-end mt-4">
                                <button className="btn">View Reports</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 