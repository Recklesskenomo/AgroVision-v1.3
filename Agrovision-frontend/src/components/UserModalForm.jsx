import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserModalForm({ isOpen, onClose, mode, onSubmit, userData, departments }) {
    const { ROLES, USER_TYPES } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user',
        department_id: '',
        user_type: 'internal'
    });

    useEffect(() => {
        if (mode === 'edit' && userData) {
            setFormData({
                ...userData,
                password: '' // Don't populate password in edit mode
            });
        } else {
            // Reset form in add mode
            setFormData({
                username: '',
                email: '',
                password: '',
                role: 'user',
                department_id: '',
                user_type: 'internal'
            });
        }
    }, [mode, userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // If editing and password is empty, remove it from the data
            const submitData = { ...formData };
            if (mode === 'edit' && !submitData.password) {
                delete submitData.password;
            }

            await onSubmit(submitData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <dialog id="user_modal" className="modal" open={isOpen}>
            <div className="modal-box max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{mode === 'edit' ? 'Edit User' : 'Add New User'}</h3>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                name="username"
                                className="input input-bordered w-full"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter username"
                            />
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter email"
                            />
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                                {mode === 'edit' && (
                                    <span className="label-text-alt">Leave blank to keep current</span>
                                )}
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="input input-bordered w-full"
                                value={formData.password}
                                onChange={handleChange}
                                required={mode === 'add'}
                                placeholder={mode === 'edit' ? '••••••••' : 'Enter password'}
                            />
                        </div>

                        {/* Role */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Role</span>
                            </label>
                            <select
                                name="role"
                                className="select select-bordered w-full"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(ROLES).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* User Type */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">User Type</span>
                            </label>
                            <select
                                name="user_type"
                                className="select select-bordered w-full"
                                value={formData.user_type}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(USER_TYPES).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Department</span>
                            </label>
                            <select
                                name="department_id"
                                className="select select-bordered w-full"
                                value={formData.department_id || ''}
                                onChange={handleChange}
                            >
                                <option value="">None</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name.charAt(0).toUpperCase() + dept.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {mode === 'edit' ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
} 