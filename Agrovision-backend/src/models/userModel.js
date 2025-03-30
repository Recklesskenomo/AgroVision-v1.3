import bcrypt from 'bcrypt';
import { query } from '../config/database.js';

// Define available roles
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    FIELD_WORKER: 'field_worker',
    DATA_ANALYST: 'data_analyst',
    USER: 'user' // Default basic role
};

// Create users table if it doesn't exist
export const initializeUserTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT '${ROLES.USER}',
            "refreshToken" TEXT,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

export const findByRole = async (role) => {
    const { rows } = await query('SELECT * FROM users WHERE role = $1', [role]);
    return rows;
};

export const createUser = async (userData) => {
    const { username, email, password, role = ROLES.USER } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await query(
        'INSERT INTO users (username, email, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [username, email, hashedPassword, role]
    );
    
    return rows[0];
};

export const updateUser = async (userId, userData) => {
    const { username, email, role } = userData;
    
    const { rows } = await query(
        'UPDATE users SET username = $1, email = $2, role = $3, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
        [username, email, role, userId]
    );
    
    return rows[0];
};

export const updateUserRole = async (userId, role) => {
    const { rows } = await query(
        'UPDATE users SET role = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [role, userId]
    );
    
    return rows[0];
};

export const updateRefreshToken = async (userId, token) => {
    const { rows } = await query(
        'UPDATE users SET "refreshToken" = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [token, userId]
    );
    return rows[0];
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export default {
    ROLES,
    initializeUserTable,
    findByEmail,
    findById,
    findByRole,
    createUser,
    updateUser,
    updateUserRole,
    updateRefreshToken,
    comparePassword
};