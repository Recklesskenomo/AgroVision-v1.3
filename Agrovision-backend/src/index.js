import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import animalRoutes from './routes/animalRoute.js';
import departmentRoutes from './routes/departmentRoutes.js';
import { testConnection, query } from './config/database.js';
import { initializeUserTable } from './models/userModel.js';
import { initializeDepartmentTable } from './models/departmentModel.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', animalRoutes);
app.use('/api/departments', departmentRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Initialize database tables
async function initializeTables() {
    try {
        // Initialize departments table first (since users reference departments)
        await initializeDepartmentTable();
        
        // Initialize users table
        await initializeUserTable();

        // Read and execute animals table initialization
        const sqlPath = path.join(__dirname, 'db', 'init.sql');
        const sqlContent = await fs.readFile(sqlPath, 'utf8');
        await query(sqlContent);
        console.log('Animals table initialized');
    } catch (error) {
        console.error('Error initializing tables:', error);
        throw error;
    }
}

// Server start
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await testConnection();
        
        // Initialize tables
        await initializeTables();
        
        // Start server with error handling
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
                server.listen(PORT + 1);
            } else {
                console.error('Server error:', error);
            }
        });

    } catch (error) {
        console.error('Unable to start server:', error);
        console.error('Error details:', error.message);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    process.exit(0);
});

startServer();