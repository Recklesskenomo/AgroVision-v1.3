import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/userModel.js';
import { auth } from '../middleware/auth.js';
import { jwtConfig } from '../config/jwtConfig.js';
import { Op } from 'sequelize';

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('username').notEmpty(),
    body('password').isLength({ min: 6 })
];

// Register
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        const { username, email, password } = req.body;
        console.log('Attempting to create user:', { username, email }); // Debug log

        const user = await User.create({ username, email, password });
        console.log('User created:', user.id); // Debug log
        
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role }, 
            jwtConfig.secret, 
            { expiresIn: jwtConfig.accessTokenExpiry }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            jwtConfig.refreshSecret,
            { expiresIn: jwtConfig.refreshTokenExpiry }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error('Registration error:', error); // Debug log
        res.status(400).json({ 
            error: error.message || 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid login credentials');
        }

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role }, 
            jwtConfig.secret, 
            { expiresIn: jwtConfig.accessTokenExpiry }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            jwtConfig.refreshSecret,
            { expiresIn: jwtConfig.refreshTokenExpiry }
        );

        // Store refresh token in database
        user.refreshToken = refreshToken;
        await user.save();

        res.json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
        
        // Find user with valid refresh token
        const user = await User.findOne({ 
            where: { 
                id: decoded.userId,
                refreshToken: refreshToken
            }
        });

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        // Generate new access token
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            jwtConfig.secret,
            { expiresIn: jwtConfig.accessTokenExpiry }
        );

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { userId: user.id },
            jwtConfig.refreshSecret,
            { expiresIn: jwtConfig.refreshTokenExpiry }
        );

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({ 
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId);
        
        // Clear refresh token
        user.refreshToken = null;
        await user.save();
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected route example
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, {
            attributes: ['id', 'username', 'email', 'role']
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add this route to check if users table exists
router.get('/test-db', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json({ 
            message: 'Users table exists',
            count: users.length,
            users: users.map(u => ({ id: u.id, username: u.username, email: u.email }))
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Database error',
            details: error.message
        });
    }
});

export default router; 