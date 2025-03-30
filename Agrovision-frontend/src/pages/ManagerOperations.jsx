import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ManagerOnly } from '../components/RoleBasedAccess';

const ManagerOperations = () => {
    const { isManager } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Check irrigation system', assignedTo: 'John', status: 'In Progress', dueDate: '2023-04-15' },
        { id: 2, title: 'Harvest Field B', assignedTo: 'Sarah', status: 'Pending', dueDate: '2023-04-18' },
        { id: 3, title: 'Maintenance of Tractor 2', assignedTo: 'Mike', status: 'Completed', dueDate: '2023-04-10' },
        { id: 4, title: 'Order new seeds', assignedTo: 'You', status: 'Pending', dueDate: '2023-04-20' },
        { id: 5, title: 'Inspect fence in Sector 3', assignedTo: 'Emma', status: 'In Progress', dueDate: '2023-04-16' }
    ]);

    const [resources, setResources] = useState([
        { id: 1, name: 'Tractor 1', status: 'Available', location: 'Equipment Shed' },
        { id: 2, name: 'Tractor 2', status: 'Maintenance', location: 'Repair Shop' },
        { id: 3, name: 'Irrigation System', status: 'Active', location: 'Fields A, B, C' },
        { id: 4, name: 'Harvester', status: 'Available', location: 'Equipment Shed' },
        { id: 5, name: 'Fertilizer Supply', status: 'Low Stock', location: 'Storage Room' }
    ]);

    // Redirect non-manager users
    React.useEffect(() => {
        if (!isManager()) {
            navigate('/dashboard');
        }
    }, [isManager, navigate]);

    // Function to update task status
    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, status: newStatus } : task
        ));
    };

    return (
        <ManagerOnly fallback={<div className="p-4">You don't have permission to access this page.</div>}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">Farm Operations Dashboard</h1>
                
                {/* Operation Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600">5</h3>
                        <p className="text-gray-600">Active Tasks</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-green-600">3</h3>
                        <p className="text-gray-600">Available Equipment</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-yellow-600">1</h3>
                        <p className="text-gray-600">Pending Deliveries</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-red-600">2</h3>
                        <p className="text-gray-600">Maintenance Alerts</p>
                    </div>
                </div>
                
                {/* Task Management */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Task Management</h2>
                        <button className="btn btn-primary btn-sm">+ New Task</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tasks.map(task => (
                                    <tr key={task.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{task.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{task.assignedTo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${task.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {task.dueDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <select 
                                                className="border rounded-md px-2 py-1 text-sm"
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Resource Management */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Resources & Equipment</h2>
                        <button className="btn btn-primary btn-sm">+ Add Resource</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {resources.map(resource => (
                                    <tr key={resource.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${resource.status === 'Available' ? 'bg-green-100 text-green-800' : 
                                                resource.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                                                resource.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                                {resource.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {resource.location}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                Update
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">
                                                Schedule Maintenance
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </ManagerOnly>
    );
};

export default ManagerOperations; 