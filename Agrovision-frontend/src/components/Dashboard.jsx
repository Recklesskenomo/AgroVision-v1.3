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
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">{getGreeting()}, {user?.username}!</h1>
                <p className="text-gray-600 mt-2">Welcome to your AgroVision dashboard.</p>
            </div>
            
            {/* Department Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Administration Department */}
                <div className="col-span-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Administration Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AdminOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">User Management</h3>
                                <p className="text-gray-600 mb-4">Manage users, roles, and permissions.</p>
                                <Link to="/admin/users" className="btn btn-primary">Manage Users</Link>
                            </div>
                        </AdminOnly>
                        <ManagerOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Sales & Logistics</h3>
                                <p className="text-gray-600 mb-4">Track sales, inventory, and shipments.</p>
                                <Link to="/manager/sales" className="btn btn-primary">View Sales</Link>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Maintenance</h3>
                                <p className="text-gray-600 mb-4">Equipment and facility maintenance tracking.</p>
                                <Link to="/manager/maintenance" className="btn btn-primary">View Maintenance</Link>
                            </div>
                        </ManagerOnly>
                        <DataAnalystOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Financial Analytics</h3>
                                <p className="text-gray-600 mb-4">View financial reports and analytics.</p>
                                <Link to="/data-analyst/analytics" className="btn btn-primary">View Analytics</Link>
                            </div>
                        </DataAnalystOnly>
                    </div>
                </div>

                {/* Animal Department */}
                <div className="col-span-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Animal Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-600">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800">Animal Management</h3>
                            <p className="text-gray-600 mb-4">Track and manage livestock information.</p>
                            <Link to="/dashboard/animals" className="btn btn-primary">View Animals</Link>
                        </div>
                        <FieldWorkerOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Health Monitoring</h3>
                                <p className="text-gray-600 mb-4">Monitor animal health and treatments.</p>
                                <Link to="/field-worker/health" className="btn btn-primary">Health Records</Link>
                            </div>
                        </FieldWorkerOnly>
                        <DataAnalystOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Performance Analytics</h3>
                                <p className="text-gray-600 mb-4">Analyze animal growth and health data.</p>
                                <Link to="/data-analyst/animal-analytics" className="btn btn-primary">View Analytics</Link>
                            </div>
                        </DataAnalystOnly>
                    </div>
                </div>

                {/* Feed Department */}
                <div className="col-span-full">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Feed Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ManagerOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Feed Inventory</h3>
                                <p className="text-gray-600 mb-4">Manage feed stock and orders.</p>
                                <Link to="/manager/feed-inventory" className="btn btn-primary">View Inventory</Link>
                            </div>
                        </ManagerOnly>
                        <FieldWorkerOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-lime-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Feed Distribution</h3>
                                <p className="text-gray-600 mb-4">Track daily feed distribution tasks.</p>
                                <Link to="/field-worker/feed-tasks" className="btn btn-primary">View Tasks</Link>
                            </div>
                        </FieldWorkerOnly>
                        <DataAnalystOnly>
                            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-600">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800">Feed Analytics</h3>
                                <p className="text-gray-600 mb-4">Analyze feed efficiency and consumption.</p>
                                <Link to="/data-analyst/feed-analytics" className="btn btn-primary">View Analytics</Link>
                            </div>
                        </DataAnalystOnly>
                    </div>
                </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
                <div className="space-y-4">
                    {/* Activity items with consistent styling */}
                    <AdminOnly>
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-blue-800">Administrative Updates</h3>
                            <ul className="list-disc pl-5 text-blue-700">
                                <li className="mb-2">New user registration: John Doe (2 hours ago)</li>
                                <li className="mb-2">Role updated for user: Sarah Smith (1 day ago)</li>
                            </ul>
                        </div>
                    </AdminOnly>
                    
                    <ManagerOnly>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-green-800">Operations Updates</h3>
                            <ul className="list-disc pl-5 text-green-700">
                                <li className="mb-2">Feed inventory updated (3 hours ago)</li>
                                <li className="mb-2">New equipment maintenance scheduled (1 day ago)</li>
                            </ul>
                        </div>
                    </ManagerOnly>
                    
                    <FieldWorkerOnly>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-yellow-800">Field Updates</h3>
                            <ul className="list-disc pl-5 text-yellow-700">
                                <li className="mb-2">Animal health check completed for Barn A (1 hour ago)</li>
                                <li className="mb-2">Feed distribution completed (4 hours ago)</li>
                            </ul>
                        </div>
                    </FieldWorkerOnly>
                    
                    <DataAnalystOnly>
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2 text-purple-800">Analytics Updates</h3>
                            <ul className="list-disc pl-5 text-purple-700">
                                <li className="mb-2">Monthly performance report generated (2 hours ago)</li>
                                <li className="mb-2">Feed efficiency analysis completed (1 day ago)</li>
                            </ul>
                        </div>
                    </DataAnalystOnly>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 