const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../../Agrovision-backend/src/middleware/auth');
const { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../config');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        
        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        
        user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
        await user.save();

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid login credentials');
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
        
        user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

// Refresh Token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findOne({ 
            _id: decoded.userId,
            'refreshTokens.token': refreshToken
        });

        if (!user) {
            throw new Error('Invalid refresh token');
        }

        const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
});

// Logout
router.post('/logout', auth, async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        const user = await User.findById(req.user.userId);
        
        user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
        await user.save();
        
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test protected route
router.get('/protected', auth, (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.user.userId });
});

module.exports = router; 