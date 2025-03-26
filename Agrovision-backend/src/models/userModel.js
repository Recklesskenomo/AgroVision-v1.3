import bcrypt from 'bcrypt';
import { query } from '../config/database.js';

// Create users table if it doesn't exist
export const initializeUserTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            refresh_token TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    try {
        await query(createTableQuery);
        console.log('Users table initialized');
    } catch (error) {
        console.error('Error initializing users table:', error);
        throw error;
    }
};

export const findByEmail = async (email) => {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
};

export const findById = async (id) => {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
};

export const createUser = async (userData) => {
    const { username, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
    );
    
    return rows[0];
};

export const updateRefreshToken = async (userId, token) => {
    const { rows } = await query(
        'UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *',
        [token, userId]
    );
    return rows[0];
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export default {
    initializeUserTable,
    findByEmail,
    findById,
    createUser,
    updateRefreshToken,
    comparePassword
};