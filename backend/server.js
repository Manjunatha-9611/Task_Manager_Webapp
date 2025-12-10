/**
 * TASK MANAGER BACKEND SERVER
 * 
 * This is the main entry point for the backend API
 * It sets up Express server, connects to MongoDB, and defines routes
 */

// Load environment variables from .env file
// This must be at the top before using process.env
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

// ============================================
// SERVER INITIALIZATION
// ============================================

// Create Express application instance
const app = express();

// Connect to MongoDB database
// This runs the connectDB function from config/db.js
connectDB();

// ============================================
// MIDDLEWARE SETUP
// ============================================

/**
 * CORS (Cross-Origin Resource Sharing) middleware
 * Allows frontend (running on different port) to make requests to this API
 * In production, you should restrict origin to your frontend domain only
 */
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend URL (Vite dev server)
    credentials: true                  // Allow cookies and authentication headers
}));

/**
 * Body parser middleware
 * Parses incoming JSON payloads and makes them available in req.body
 */
app.use(express.json());

/**
 * URL-encoded parser middleware
 * Parses form data from POST requests
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Request logging middleware (for development)
 * Logs every incoming request to console
 */
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ============================================
// ROUTES
// ============================================

/**
 * Root endpoint - API health check
 * Useful for verifying the server is running
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Task Manager API is running',
        version: '1.0.0'
    });
});

/**
 * Authentication routes
 * Handles user registration and login
 * Base path: /api/auth
 */
app.use('/api/auth', authRoutes);

/**
 * Task routes
 * Handles all task CRUD operations
 * Base path: /api/tasks
 * All routes in taskRoutes are protected (require authentication)
 */
app.use('/api/tasks', taskRoutes);

// ============================================
// ERROR HANDLING
// ============================================

/**
 * 404 handler - Route not found
 * This runs if no other route matches the request
 */
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

/**
 * Global error handler
 * Catches any errors that occur during request processing
 */
app.use((err, req, res, next) => {
    console.error('Server error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================

// Get port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start listening for requests
app.listen(PORT, () => {
    console.log(`\n✅ Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}/api\n`);
});
