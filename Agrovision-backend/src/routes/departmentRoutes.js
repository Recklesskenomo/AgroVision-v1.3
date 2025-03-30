import express from 'express';
import * as departmentModel from '../models/departmentModel.js';
import * as userModel from '../models/userModel.js';
import { auth, isAdmin, hasRole } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

// Get all departments - accessible to all authenticated users
router.get('/', auth, async (req, res) => {
    try {
        const departments = await departmentModel.getAllDepartments();
        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get department by ID - accessible to all authenticated users
router.get('/:id', auth, async (req, res) => {
    try {
        const department = await departmentModel.getDepartmentById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all users in a department - accessible to managers and admins
router.get('/:id/users', auth, hasRole([userModel.ROLES.ADMIN, userModel.ROLES.MANAGER, userModel.ROLES.DEPARTMENT_MANAGER]), async (req, res) => {
    try {
        const users = await userModel.findByDepartment(req.params.id);
        
        // Filter out sensitive information
        const filteredUsers = users.map(user => {
            const { password, refreshToken, ...userInfo } = user;
            return userInfo;
        });
        
        res.json(filteredUsers);
    } catch (error) {
        console.error('Error fetching department users:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Create a new department
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Department name is required' });
        }
        
        // Check if department already exists
        const existingDepartment = await departmentModel.getDepartmentByName(name);
        if (existingDepartment) {
            return res.status(400).json({ message: 'Department already exists' });
        }
        
        // Create department
        const result = await query(
            'INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *',
            [name, description || null]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating department:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update a department
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Department name is required' });
        }
        
        // Check if department exists
        const existingDepartment = await departmentModel.getDepartmentById(id);
        if (!existingDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        // Update department
        const result = await query(
            'UPDATE departments SET name = $1, description = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [name, description || existingDepartment.description, id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Delete a department
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if department exists
        const existingDepartment = await departmentModel.getDepartmentById(id);
        if (!existingDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        
        // First, update users in this department to have null department_id
        await query('UPDATE users SET department_id = NULL WHERE department_id = $1', [id]);
        
        // Delete department
        await query('DELETE FROM departments WHERE id = $1', [id]);
        
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router; 