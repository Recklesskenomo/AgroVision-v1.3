import * as userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const register = async (userData) => {
    try {
        // Check if user exists
        const existingUser = await userModel.findByEmail(userData.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create new user
        const newUser = await userModel.createUser(userData);

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // Update user with refresh token
        await userModel.updateRefreshToken(newUser.id, refreshToken);

        return {
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            },
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error('Auth service register error:', error);
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const { email, password } = credentials;

        // Find user
        const user = await userModel.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await userModel.comparePassword(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
        }

        // Generate tokens
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

        // Update user with refresh token
        await userModel.updateRefreshToken(user.id, refreshToken);

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        };
    } catch (error) {
        console.error('Auth service login error:', error);
        throw error;
    }
};

export const refreshAccessToken = async (token) => {
    try {
        // Verify refresh token
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        
        // Find user
        const user = await userModel.findById(decoded.userId);
        if (!user || user.refresh_token !== token) {
            throw new Error('Invalid refresh token');
        }

        // Generate new tokens
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

        // Update user with new refresh token
        await userModel.updateRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Auth service refresh token error:', error);
        throw error;
    }
};

export const logout = async (userId) => {
    try {
        await userModel.updateRefreshToken(userId, null);
    } catch (error) {
        console.error('Auth service logout error:', error);
        throw error;
    }
}; 