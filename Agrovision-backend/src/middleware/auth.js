import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
}; 