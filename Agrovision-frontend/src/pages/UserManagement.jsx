import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { AdminOnly } from '../components/RoleBasedAccess';
import UserModalForm from '../components/UserModalForm';

const API_URL = 'http://localhost:3000/api/auth';
const DEPT_API_URL = 'http://localhost:3000/api/departments';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [departmentsLoading, setDepartmentsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [selectedUser, setSelectedUser] = useState(null);
    
    const { isAdmin, ROLES, USER_TYPES } = useAuth();
    const navigate = useNavigate();

    // Redirect non-admin users
    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/users`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
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

    useEffect(() => {
        fetchUsers();
    }, []);
    
    // Fetch all departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setDepartmentsLoading(true);
                const response = await axios.get(DEPT_API_URL, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setDepartments(response.data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                setDepartmentsLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department_name && user.department_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Handle form submission
    const handleSubmit = async (userData) => {
        try {
            if (modalMode === 'add') {
                const response = await axios.post(`${API_URL}/users`, userData, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                setUsers([...users, response.data]);
            } else {
                // Update user data one by one using specific endpoints
                if (userData.role !== selectedUser.role) {
                    await axios.put(`${API_URL}/users/${selectedUser.id}/role`, 
                        { role: userData.role },
                        {
                            withCredentials: true,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        }
                    );
                }

                if (userData.department_id !== selectedUser.department_id) {
                    await axios.put(`${API_URL}/users/${selectedUser.id}/department`,
                        { department_id: userData.department_id },
                        {
                            withCredentials: true,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        }
                    );
                }

                if (userData.user_type !== selectedUser.user_type) {
                    await axios.put(`${API_URL}/users/${selectedUser.id}/usertype`,
                        { user_type: userData.user_type },
                        {
                            withCredentials: true,
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                            }
                        }
                    );
                }
            }
            setIsModalOpen(false);
            setSelectedUser(null);
            setError(null);
            // Refresh the users list
            fetchUsers();
        } catch (error) {
            console.error('Error handling user:', error);
            setError(error.response?.data?.message || 'Failed to process user. Please try again.');
        }
    };

    // Handle delete user
    const handleDelete = async (id) => {
        try {
            // Using the correct endpoint for deleting users
            await axios.delete(`${API_URL}/users/${id}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setUsers(users.filter(user => user.id !== id));
            setDeleteId(null);
            setError(null);
            // Refresh the users list to ensure we have the latest data
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Failed to delete user. Please try again.');
        }
    };

    // Get department name by ID
    const getDepartmentName = (departmentId) => {
        if (!departmentId) return 'None';
        const department = departments.find(d => d.id === departmentId);
        return department ? department.name : 'Unknown';
    };

    return (
        <AdminOnly fallback={<div className="p-4">You don't have permission to access this page.</div>}>
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-base-100 shadow-xl rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">User Management</h1>
                            <button 
                                onClick={() => {
                                    setModalMode('add');
                                    setSelectedUser(null);
                                    setIsModalOpen(true);
                                }}
                                className="btn btn-primary"
                            >
                                Add New User
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="input input-bordered w-full max-w-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="alert alert-error mb-4">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex justify-center items-center p-8">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Department</th>
                                            <th>User Type</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="hover">
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id}>
                                                <th></th>
                                                <th>{user.id}</th>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{getDepartmentName(user.department_id)}</td>
                                                <td>{user.user_type}</td>
                                                <td>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setModalMode('edit');
                                                                setSelectedUser(user);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="btn btn-secondary btn-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        
                                                        {deleteId === user.id ? (
                                                            <div className="join">
                                                                <button 
                                                                    className="btn btn-error btn-sm join-item"
                                                                    onClick={() => handleDelete(user.id)}
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm join-item"
                                                                    onClick={() => setDeleteId(null)}
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                className="btn btn-error btn-sm"
                                                                onClick={() => setDeleteId(user.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <UserModalForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedUser(null);
                }}
                mode={modalMode}
                onSubmit={handleSubmit}
                userData={selectedUser}
                departments={departments}
            />
        </AdminOnly>
    );
};

export default UserManagement; 