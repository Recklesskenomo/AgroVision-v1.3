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
                <h3 className="font-bold text-lg py-4">{mode === 'edit' ? 'Edit User' : 'Add New User'}</h3>
                <form method="dialog" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="input input-bordered flex items-center gap-2">
                            Username
                            <input
                                type="text"
                                name="username"
                                className="grow"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            Email
                            <input
                                type="email"
                                name="email"
                                className="grow"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            Password
                            <input
                                type="password"
                                name="password"
                                className="grow"
                                value={formData.password}
                                onChange={handleChange}
                                required={mode === 'add'}
                                placeholder={mode === 'edit' ? 'Leave blank to keep current' : ''}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            Role
                            <select
                                name="role"
                                className="grow bg-transparent border-none focus:outline-none"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(ROLES).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-base-100">
                                        {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            User Type
                            <select
                                name="user_type"
                                className="grow bg-transparent border-none focus:outline-none"
                                value={formData.user_type}
                                onChange={handleChange}
                                required
                            >
                                {Object.entries(USER_TYPES).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-base-100">
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="input input-bordered flex items-center gap-2">
                            Department
                            <select
                                name="department_id"
                                className="grow bg-transparent border-none focus:outline-none"
                                value={formData.department_id || ''}
                                onChange={handleChange}
                            >
                                <option value="" className="bg-base-100">None</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id} className="bg-base-100">
                                        {dept.name.charAt(0).toUpperCase() + dept.name.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            {mode === 'edit' ? 'Save Changes' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
} 