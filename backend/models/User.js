// Import mongoose to define schemas and models
const mongoose = require('mongoose');

/**
 * User Schema - Defines the structure of user documents in MongoDB
 * 
 * Fields:
 * - username: Unique identifier for the user (required)
 * - email: User's email address, must be unique and valid (required)
 * - password: Hashed password for authentication (required)
 * - createdAt & updatedAt: Automatically managed timestamps
 */
const userSchema = new mongoose.Schema(
    {
        // Username field
        username: {
            type: String,           // Data type is string
            required: [true, 'Please add a username'],  // Required with custom error message
            unique: true,           // Must be unique across all users
            trim: true,             // Remove whitespace from both ends
            minlength: [3, 'Username must be at least 3 characters long']
        },

        // Email field
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,           // Must be unique across all users
            lowercase: true,        // Convert to lowercase before saving
            trim: true,
            match: [               // Regex validation for email format
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },

        // Password field - will store hashed password
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters long']
            // Note: We don't set maxlength here because hashed passwords are longer
        }
    },
    {
        // Enable automatic timestamps
        // This will add createdAt and updatedAt fields automatically
        timestamps: true
    }
);

/**
 * Index on email for faster lookups
 * When users login with email, MongoDB can find the user quickly
 */
userSchema.index({ email: 1 });

// Create and export the User model
// mongoose.model creates a model class from the schema
// First param: Name of the model (MongoDB will create a 'users' collection)
// Second param: The schema to use
module.exports = mongoose.model('User', userSchema);
