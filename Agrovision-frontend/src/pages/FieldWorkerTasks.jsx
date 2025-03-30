import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FieldWorkerOnly } from '../components/RoleBasedAccess';

const FieldWorkerTasks = () => {
    const { user, hasRole, ROLES } = useAuth();
    const navigate = useNavigate();
    
    // Example tasks for the field worker
    const [tasks, setTasks] = useState([
        { 
            id: 1, 
            title: 'Check irrigation system in Field A', 
            description: 'Ensure all sprinklers are functioning correctly, check for leaks and blockages.',
            status: 'In Progress', 
            dueDate: '2023-04-15',
            priority: 'High'
        },
        { 
            id: 2, 
            title: 'Feed livestock in Barn 2', 
            description: 'Distribute feed according to the feeding schedule chart.',
            status: 'Pending', 
            dueDate: '2023-04-16',
            priority: 'Medium'
        },
        { 
            id: 3, 
            title: 'Collect soil samples from Field B', 
            description: 'Take samples from 5 different locations and label them according to protocol.',
            status: 'Completed', 
            dueDate: '2023-04-12',
            priority: 'Medium'
        },
        { 
            id: 4, 
            title: 'Apply fertilizer to apple orchard', 
            description: 'Use organic fertilizer mix as per instructions, wear protective gear.',
            status: 'Pending', 
            dueDate: '2023-04-18',
            priority: 'High'
        },
        { 
            id: 5, 
            title: 'Repair fence in southern pasture', 
            description: 'Use materials from the maintenance shed, check for loose posts.',
            status: 'Pending', 
            dueDate: '2023-04-20',
            priority: 'Low'
        }
    ]);

    // Redirect non-field worker users
    React.useEffect(() => {
        if (!hasRole(ROLES.FIELD_WORKER)) {
            navigate('/dashboard');
        }
    }, [hasRole, navigate, ROLES.FIELD_WORKER]);

    // Function to update task status
    const updateTaskStatus = (id, newStatus) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, status: newStatus } : task
        ));
    };

    // Filter tasks by status
    const pendingTasks = tasks.filter(task => task.status === 'Pending');
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
    const completedTasks = tasks.filter(task => task.status === 'Completed');

    return (
        <FieldWorkerOnly fallback={<div className="p-4">You don't have permission to access this page.</div>}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">My Field Tasks</h1>
                
                {/* Task Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-yellow-600">{pendingTasks.length}</h3>
                        <p className="text-gray-600">Pending Tasks</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-blue-600">{inProgressTasks.length}</h3>
                        <p className="text-gray-600">In Progress</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-green-600">{completedTasks.length}</h3>
                        <p className="text-gray-600">Completed</p>
                    </div>
                </div>
                
                {/* Task Management */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold">Today's Tasks</h2>
                        <p className="text-gray-600">Update task status as you progress through your work.</p>
                    </div>
                    
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task.id} className={`border-l-4 rounded-md shadow-sm p-4
                                ${task.status === 'Completed' ? 'border-green-500 bg-green-50' : 
                                task.status === 'In Progress' ? 'border-blue-500 bg-blue-50' : 
                                'border-yellow-500 bg-yellow-50'}`}>
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-medium">{task.title}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-green-100 text-green-800'}`}>
                                        {task.priority} Priority
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2 mb-3">{task.description}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Due: {task.dueDate}
                                    </div>
                                    <div className="flex space-x-2">
                                        <select 
                                            className="border rounded-md px-2 py-1 text-sm"
                                            value={task.status}
                                            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm">
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Daily Log */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Daily Activity Log</h2>
                    <div className="mb-4">
                        <textarea 
                            className="w-full border rounded-md px-3 py-2 h-32"
                            placeholder="Record your daily activities, observations, and notes here..."
                        ></textarea>
                    </div>
                    <div className="flex justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Attach Photos
                            </label>
                            <input type="file" className="text-sm text-gray-500" multiple />
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                            Submit Daily Log
                        </button>
                    </div>
                </div>
            </div>
        </FieldWorkerOnly>
    );
};

export default FieldWorkerTasks; 