import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AdminOnly } from '../components/RoleBasedAccess';

const API_URL = 'http://localhost:3000/api/auth';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUserData, setNewUserData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });
    const { isAdmin, ROLES } = useAuth();
    const navigate = useNavigate();

    // Redirect non-admin users
    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/users`, {
                    withCredentials: true
                });
                setUsers(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Failed to load users. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.put(`${API_URL}/users/${userId}/role`, 
                { role: newRole }, 
                { withCredentials: true }
            );
            
            // Update users list with the updated user
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: response.data.role } : user
            ));
            
            setError(null);
        } catch (error) {
            console.error('Error updating role:', error);
            setError('Failed to update user role. Please try again.');
        }
    };

    // Handle new user form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({
            ...newUserData,
            [name]: value
        });
    };

    // Handle new user creation
    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/users`, 
                newUserData, 
                { withCredentials: true }
            );
            
            // Add new user to the list
            setUsers([...users, response.data]);
            
            // Reset form
            setNewUserData({
                username: '',
                email: '',
                password: '',
                role: 'user'
            });
            
            setError(null);
        } catch (error) {
            console.error('Error creating user:', error);
            setError(error.response?.data?.message || 'Failed to create user. Please try again.');
        }
    };

    return (
        <AdminOnly fallback={<div className="p-4">You don't have permission to access this page.</div>}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">User Management</h1>
                
                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {/* Create new user form */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Create New User</h2>
                    <form onSubmit={handleCreateUser}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={newUserData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={newUserData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUserData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Role</label>
                                <select
                                    name="role"
                                    value={newUserData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    {Object.entries(ROLES).map(([key, value]) => (
                                        <option key={key} value={value}>
                                            {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Create User
                        </button>
                    </form>
                </div>
                
                {/* Users list */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <h2 className="text-xl font-semibold p-6 border-b">Users</h2>
                    
                    {loading ? (
                        <div className="p-6 text-center">
                            <span className="loading loading-spinner loading-md"></span>
                            <span className="ml-2">Loading users...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Username
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created At
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="border rounded-md px-2 py-1"
                                                    >
                                                        {Object.entries(ROLES).map(([key, value]) => (
                                                            <option key={key} value={value}>
                                                                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                    onClick={() => {/* View user details */}}
                                                >
                                                    View
                                                </button>
                                                {/* Add more actions as needed */}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminOnly>
    );
};

export default UserManagement; 