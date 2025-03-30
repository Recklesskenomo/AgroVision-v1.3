import bcrypt from 'bcrypt';
import { query } from '../config/database.js';

// Define available roles
export const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    FIELD_WORKER: 'field_worker',
    DATA_ANALYST: 'data_analyst',
    USER: 'user', // Default basic role
    CONSULTANT: 'consultant', // External consultant (vets/agronomists)
    DEPARTMENT_MANAGER: 'department_manager' // Department manager
};

// Define user types
export const USER_TYPES = {
    INTERNAL: 'internal', // Regular employee
    EXTERNAL: 'external', // External consultant
    ADMIN: 'admin' // Administrator
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
            department_id INTEGER,
            user_type VARCHAR(20) DEFAULT '${USER_TYPES.INTERNAL}',
            "refreshToken" TEXT,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
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

export const findByDepartment = async (departmentId) => {
    const { rows } = await query('SELECT * FROM users WHERE department_id = $1', [departmentId]);
    return rows;
};

export const createUser = async (userData) => {
    const { 
        username, 
        email, 
        password, 
        role = ROLES.USER,
        department_id = null,
        user_type = USER_TYPES.INTERNAL
    } = userData;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { rows } = await query(
        'INSERT INTO users (username, email, password, role, department_id, user_type, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *',
        [username, email, hashedPassword, role, department_id, user_type]
    );
    
    return rows[0];
};

export const updateUser = async (userId, userData) => {
    const { username, email, role, department_id, user_type } = userData;
    
    const { rows } = await query(
        'UPDATE users SET username = $1, email = $2, role = $3, department_id = $4, user_type = $5, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
        [username, email, role, department_id, user_type, userId]
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

export const updateUserDepartment = async (userId, departmentId) => {
    const { rows } = await query(
        'UPDATE users SET department_id = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
        [departmentId, userId]
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
    USER_TYPES,
    initializeUserTable,
    findByEmail,
    findById,
    findByRole,
    findByDepartment,
    createUser,
    updateUser,
    updateUserRole,
    updateUserDepartment,
    updateRefreshToken,
    comparePassword
};