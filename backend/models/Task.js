// Import mongoose to define schemas and models
const mongoose = require('mongoose');

/**
 * Task Schema - Defines the structure of task documents in MongoDB
 * 
 * Fields:
 * - user: Reference to the User who owns this task (for data isolation)
 * - title: Brief description of the task (required)
 * - description: Detailed description of the task (optional)
 * - completed: Boolean flag indicating if task is done (default: false)
 * - createdAt & updatedAt: Automatically managed timestamps
 */
const taskSchema = new mongoose.Schema(
    {
        // Reference to the user who created this task
        // This ensures each user only sees their own tasks
        user: {
            type: mongoose.Schema.Types.ObjectId,  // MongoDB ObjectId type
            required: true,                         // Every task must have an owner
            ref: 'User'                            // References the User model
        },

        // Task title - main description
        title: {
            type: String,
            required: [true, 'Please add a task title'],  // Required field
            trim: true,                                    // Remove whitespace
            maxlength: [200, 'Title cannot be more than 200 characters']
        },

        // Task description - optional detailed info
        description: {
            type: String,
            trim: true,
            default: '',                                   // Empty string if not provided
            maxlength: [1000, 'Description cannot be more than 1000 characters']
        },

        // Completion status
        completed: {
            type: Boolean,
            default: false                                 // New tasks are incomplete by default
        }
    },
    {
        // Enable automatic timestamps
        timestamps: true
    }
);

/**
 * Compound index on user and createdAt for efficient queries
 * This helps when fetching all tasks for a user sorted by creation date
 * -1 means descending order (newest first)
 */
taskSchema.index({ user: 1, createdAt: -1 });

// Create and export the Task model
module.exports = mongoose.model('Task', taskSchema);
