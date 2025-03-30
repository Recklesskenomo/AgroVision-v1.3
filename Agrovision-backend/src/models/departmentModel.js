import { query } from '../config/database.js';

// Define available departments
export const DEPARTMENTS = {
    // Administration
    ADMINISTRATION: 'administration',
    LOGISTICS: 'logistics',
    SALES: 'sales',
    MAINTENANCE: 'maintenance',
    HR: 'hr',
    
    // Animals
    ANIMALS: 'animals',
    
    // Feed
    FEED: 'feed'
};

// Department groups
export const DEPARTMENT_GROUPS = {
    ADMINISTRATION: [
        DEPARTMENTS.ADMINISTRATION,
        DEPARTMENTS.LOGISTICS,
        DEPARTMENTS.SALES,
        DEPARTMENTS.MAINTENANCE,
        DEPARTMENTS.HR
    ],
    ANIMALS: [
        DEPARTMENTS.ANIMALS
    ],
    FEED: [
        DEPARTMENTS.FEED
    ]
};

// Create departments table if it doesn't exist
export const initializeDepartmentTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS departments (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) UNIQUE NOT NULL,
            description TEXT,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    
    try {
        await query(createTableQuery);
        console.log('Departments table initialized');
        
        // Insert default departments if they don't exist
        for (const dept of Object.values(DEPARTMENTS)) {
            const { rows } = await query('SELECT * FROM departments WHERE name = $1', [dept]);
            if (rows.length === 0) {
                await query(
                    'INSERT INTO departments (name, description) VALUES ($1, $2)',
                    [dept, `${dept.charAt(0).toUpperCase() + dept.slice(1)} department`]
                );
            }
        }
        console.log('Default departments created');
    } catch (error) {
        console.error('Error initializing departments table:', error);
        throw error;
    }
};

export const getAllDepartments = async () => {
    const { rows } = await query('SELECT * FROM departments ORDER BY name');
    return rows;
};

export const getDepartmentById = async (id) => {
    const { rows } = await query('SELECT * FROM departments WHERE id = $1', [id]);
    return rows[0];
};

export const getDepartmentByName = async (name) => {
    const { rows } = await query('SELECT * FROM departments WHERE name = $1', [name]);
    return rows[0];
};

export default {
    DEPARTMENTS,
    DEPARTMENT_GROUPS,
    initializeDepartmentTable,
    getAllDepartments,
    getDepartmentById,
    getDepartmentByName
}; 