import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import sequelize from './config/database.js';
// Import the User model
import './models/userModel.js';

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

// Test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established.');
        
        // Force sync in development (this will drop tables if they exist)
        await sequelize.sync({ force: true });
        console.log('Database synced and tables created.');

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