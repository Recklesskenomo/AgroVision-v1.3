import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AdminOnly, ManagerOnly, FieldWorkerOnly, DataAnalystOnly } from '../components/RoleBasedAccess';

const Dashboard = () => {
    const { user, ROLES } = useAuth();

    // Get a greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Welcome Section */}
                <div className="bg-base-100 shadow-xl rounded-lg p-6 mb-8">
                    <h1 className="text-3xl font-bold text-base-content">{getGreeting()}, {user?.username}!</h1>
                    <p className="text-base-content/70 mt-2">Welcome to your AgroVision dashboard.</p>
                </div>
                
                {/* Department Sections */}
                <div className="space-y-8">
                    {/* Administration Department */}
                    <div className="bg-base-100 shadow-xl rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-base-content">Administration Department</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AdminOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">User Management</h3>
                                        <p className="text-base-content/70">Manage users, roles, and permissions.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
                                        </div>
                                    </div>
                                </div>
                            </AdminOnly>
                            <ManagerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Sales & Logistics</h3>
                                        <p className="text-base-content/70">Track sales, inventory, and shipments.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/manager/sales" className="btn btn-primary">View Sales</Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Maintenance</h3>
                                        <p className="text-base-content/70">Equipment and facility maintenance tracking.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/manager/maintenance" className="btn btn-primary">View Maintenance</Link>
                                        </div>
                                    </div>
                                </div>
                            </ManagerOnly>
                            <DataAnalystOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Financial Analytics</h3>
                                        <p className="text-base-content/70">View financial reports and analytics.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/data-analyst/analytics" className="btn btn-primary">View Analytics</Link>
                                        </div>
                                    </div>
                                </div>
                            </DataAnalystOnly>
                        </div>
                    </div>

                    {/* Animal Department */}
                    <div className="bg-base-100 shadow-xl rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-base-content">Animal Department</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="card bg-base-100 shadow-md">
                                <div className="card-body">
                                    <h3 className="card-title">Animal Management</h3>
                                    <p className="text-base-content/70">Track and manage livestock information.</p>
                                    <div className="card-actions justify-end mt-4">
                                        <Link to="/dashboard/animals" className="btn btn-primary">View Animals</Link>
                                    </div>
                                </div>
                            </div>
                            <FieldWorkerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Health Monitoring</h3>
                                        <p className="text-base-content/70">Monitor animal health and treatments.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/field-worker/health" className="btn btn-primary">Health Records</Link>
                                        </div>
                                    </div>
                                </div>
                            </FieldWorkerOnly>
                            <DataAnalystOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Performance Analytics</h3>
                                        <p className="text-base-content/70">Analyze animal growth and health data.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/data-analyst/animal-analytics" className="btn btn-primary">View Analytics</Link>
                                        </div>
                                    </div>
                                </div>
                            </DataAnalystOnly>
                        </div>
                    </div>

                    {/* Feed Department */}
                    <div className="bg-base-100 shadow-xl rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-base-content">Feed Department</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ManagerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Feed Inventory</h3>
                                        <p className="text-base-content/70">Manage feed stock and orders.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/manager/feed-inventory" className="btn btn-primary">View Inventory</Link>
                                        </div>
                                    </div>
                                </div>
                            </ManagerOnly>
                            <FieldWorkerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Feed Distribution</h3>
                                        <p className="text-base-content/70">Track daily feed distribution tasks.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/field-worker/feed-tasks" className="btn btn-primary">View Tasks</Link>
                                        </div>
                                    </div>
                                </div>
                            </FieldWorkerOnly>
                            <DataAnalystOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Feed Analytics</h3>
                                        <p className="text-base-content/70">Analyze feed efficiency and consumption.</p>
                                        <div className="card-actions justify-end mt-4">
                                            <Link to="/data-analyst/feed-analytics" className="btn btn-primary">View Analytics</Link>
                                        </div>
                                    </div>
                                </div>
                            </DataAnalystOnly>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-base-100 shadow-xl rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-6 text-base-content">Recent Activity</h2>
                        <div className="space-y-4">
                            <AdminOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Administrative Updates</h3>
                                        <ul className="list-disc pl-5 text-base-content/70">
                                            <li className="mb-2">New user registration: John Doe (2 hours ago)</li>
                                            <li className="mb-2">Role updated for user: Sarah Smith (1 day ago)</li>
                                        </ul>
                                    </div>
                                </div>
                            </AdminOnly>
                            
                            <ManagerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Operations Updates</h3>
                                        <ul className="list-disc pl-5 text-base-content/70">
                                            <li className="mb-2">Feed inventory updated (3 hours ago)</li>
                                            <li className="mb-2">New equipment maintenance scheduled (1 day ago)</li>
                                        </ul>
                                    </div>
                                </div>
                            </ManagerOnly>
                            
                            <FieldWorkerOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Field Updates</h3>
                                        <ul className="list-disc pl-5 text-base-content/70">
                                            <li className="mb-2">Animal health check completed for Barn A (1 hour ago)</li>
                                            <li className="mb-2">Feed distribution completed (4 hours ago)</li>
                                        </ul>
                                    </div>
                                </div>
                            </FieldWorkerOnly>
                            
                            <DataAnalystOnly>
                                <div className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <h3 className="card-title">Analytics Updates</h3>
                                        <ul className="list-disc pl-5 text-base-content/70">
                                            <li className="mb-2">Monthly performance report generated (2 hours ago)</li>
                                            <li className="mb-2">Feed efficiency analysis completed (1 day ago)</li>
                                        </ul>
                                    </div>
                                </div>
                            </DataAnalystOnly>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 