// Import mongoose library for MongoDB connection
const mongoose = require('mongoose');

/**
 * connectDB - Establishes connection to MongoDB database
 * 
 * This function:
 * 1. Reads the MongoDB URI from environment variables
 * 2. Attempts to connect to the database using mongoose
 * 3. Logs success or error messages
 * 4. Exits the process if connection fails
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error details if connection fails
    console.error(`Error: ${error.message}`);
    
    // Exit process with failure code (1)
    // This will stop the server from starting if DB connection fails
    process.exit(1);
  }
};

// Export the function so it can be used in server.js
module.exports = connectDB;
