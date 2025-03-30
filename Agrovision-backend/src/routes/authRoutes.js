import express from 'express';
import jwt from 'jsonwebtoken';
import * as userModel from '../models/userModel.js';
import { auth, isAdmin, hasRole } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        const { username, email, password, role } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user (regular users can only be created with default role)
        const user = await userModel.createUser({ username, email, password });
        console.log('User created:', user);
        
        const accessToken = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '7d' }
        );
        
        await userModel.updateRefreshToken(user.id, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        const user = await userModel.findByEmail(email);
        
        if (!user || !(await userModel.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        const accessToken = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_REFRESH_SECRET, 
            { expiresIn: '7d' }
        );
        
        await userModel.updateRefreshToken(user.id, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({ message: error.message });
    }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await userModel.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(401).json({ message: 'Invalid refresh token' });
    }
});

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        await userModel.updateRefreshToken(req.user.userId, null);
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Protected route test
router.get('/protected', auth, (req, res) => {
    res.json({ 
        message: 'This is a protected route', 
        userId: req.user.userId,
        role: req.user.role 
    });
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't send sensitive information like password or refresh token
        const { password, refreshToken, ...userInfo } = user;
        res.json(userInfo);
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const { rows } = await query(`
            SELECT u.id, u.username, u.email, u.role, u.user_type, u.department_id, 
                   d.name as department_name, u."createdAt", u."updatedAt" 
            FROM users u
            LEFT JOIN departments d ON u.department_id = d.id
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Create user with specific role
router.post('/users', auth, isAdmin, async (req, res) => {
    try {
        const { username, email, password, role, department_id, user_type } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }
        
        // Validate role
        const validRoles = Object.values(userModel.ROLES);
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ 
                message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
            });
        }
        
        // Validate user type
        const validUserTypes = Object.values(userModel.USER_TYPES);
        if (user_type && !validUserTypes.includes(user_type)) {
            return res.status(400).json({ 
                message: `Invalid user type. Must be one of: ${validUserTypes.join(', ')}` 
            });
        }
        
        // Check if user exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create new user with specified role and department
        const user = await userModel.createUser({ 
            username, 
            email, 
            password, 
            role: role || userModel.ROLES.USER,
            department_id: department_id || null,
            user_type: user_type || userModel.USER_TYPES.INTERNAL
        });
        
        // Don't send sensitive information
        const { password: pwd, refreshToken, ...userInfo } = user;
        res.status(201).json(userInfo);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update user role
router.put('/users/:id/role', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }
        
        // Validate role
        const validRoles = Object.values(userModel.ROLES);
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
            });
        }
        
        // Check if user exists
        const existingUser = await userModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user role
        const updatedUser = await userModel.updateUserRole(id, role);
        
        // Don't send sensitive information
        const { password, refreshToken, ...userInfo } = updatedUser;
        res.json(userInfo);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update user department
router.put('/users/:id/department', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { department_id } = req.body;
        
        // Check if user exists
        const existingUser = await userModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user department
        const updatedUser = await userModel.updateUserDepartment(id, department_id);
        
        // Don't send sensitive information
        const { password, refreshToken, ...userInfo } = updatedUser;
        res.json(userInfo);
    } catch (error) {
        console.error('Error updating user department:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin: Update user type
router.put('/users/:id/usertype', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { user_type } = req.body;
        
        if (!user_type) {
            return res.status(400).json({ message: 'User type is required' });
        }
        
        // Validate user type
        const validUserTypes = Object.values(userModel.USER_TYPES);
        if (!validUserTypes.includes(user_type)) {
            return res.status(400).json({ 
                message: `Invalid user type. Must be one of: ${validUserTypes.join(', ')}` 
            });
        }
        
        // Check if user exists
        const existingUser = await userModel.findById(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user type
        const { rows } = await query(
            'UPDATE users SET user_type = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [user_type, id]
        );
        
        // Don't send sensitive information
        const { password, refreshToken, ...userInfo } = rows[0];
        res.json(userInfo);
    } catch (error) {
        console.error('Error updating user type:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router; 