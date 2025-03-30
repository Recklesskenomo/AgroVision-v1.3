import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig.js';
import * as userModel from '../models/userModel.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // Fetch the user to get the current role
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        // Add user data to request with role information
        req.user = {
            userId: decoded.userId,
            role: user.role
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

// Middleware to check if user has required role
export const hasRole = (roles) => {
    return async (req, res, next) => {
        try {
            // Auth middleware should be called before this
            if (!req.user) {
                return res.status(401).json({ error: 'Please authenticate.' });
            }
            
            // If roles is a string, convert to array
            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            
            // Check if user's role is in the allowed roles array
            if (allowedRoles.includes(req.user.role)) {
                next();
            } else {
                res.status(403).json({ 
                    error: 'Access denied. You do not have the required permissions.' 
                });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};

// Middleware to check if user is an admin
export const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Please authenticate.' });
        }
        
        if (req.user.role === userModel.ROLES.ADMIN) {
            next();
        } else {
            res.status(403).json({ 
                error: 'Access denied. Admin privileges required.' 
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 