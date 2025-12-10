// Import required modules
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

/**
 * TASK ROUTES
 * 
 * All routes in this file are PROTECTED
 * Users must be authenticated (have valid JWT token) to access these routes
 * The protect middleware runs before each route handler
 */

// ============================================
// GET /api/tasks
// Get all tasks for the authenticated user
// Protected route
// ============================================
router.get('/', protect, async (req, res) => {
    try {
        // Find all tasks belonging to the authenticated user
        // req.user is set by the protect middleware
        // Sort by creation date (newest first: -1 = descending)
        const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

        // Return tasks array
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
});

// ============================================
// POST /api/tasks
// Create a new task
// Protected route
// ============================================
router.post(
    '/',
    protect,
    [
        // Validation: title is required
        body('title')
            .trim()
            .notEmpty()
            .withMessage('Task title is required')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            // Extract data from request body
            const { title, description } = req.body;

            // Create new task in database
            // Automatically associate with the authenticated user
            const task = await Task.create({
                user: req.user._id,           // User ID from protect middleware
                title,
                description: description || '', // Use empty string if not provided
                completed: false               // New tasks are incomplete by default
            });

            // DEBUG: Log task creation
            console.log('✅ Task created:', { id: task._id, title: task.title, user: task.user });

            // Return the created task with 201 status (Created)
            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Server error while creating task' });
        }
    }
);

// ============================================
// PUT /api/tasks/:id
// Update an existing task
// Protected route
// ============================================
router.put(
    '/:id',
    protect,
    [
        // Validation rules for update
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Title cannot be empty')
            .isLength({ max: 200 })
            .withMessage('Title cannot exceed 200 characters'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters'),
        body('completed')
            .optional()
            .isBoolean()
            .withMessage('Completed must be true or false')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            // Find task by ID and verify ownership
            // This ensures users can only update their own tasks
            const task = await Task.findOne({
                _id: req.params.id,           // Task ID from URL parameter
                user: req.user._id            // Must belong to authenticated user
            });

            // Check if task exists and belongs to user
            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }

            // Update task fields
            // Only update fields that were provided in request
            if (req.body.title !== undefined) task.title = req.body.title;
            if (req.body.description !== undefined) task.description = req.body.description;
            if (req.body.completed !== undefined) task.completed = req.body.completed;

            // Save updated task to database
            const updatedTask = await task.save();

            // Return updated task
            res.json(updatedTask);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Server error while updating task' });
        }
    }
);

// ============================================
// DELETE /api/tasks/:id
// Delete a task
// Protected route
// ============================================
router.delete('/:id', protect, async (req, res) => {
    try {
        // Find task by ID and verify ownership
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id              // Ensure user owns this task
        });

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Delete the task from database
        await task.deleteOne();

        // Return success message
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Server error while deleting task' });
    }
});

// Export router to be used in server.js
module.exports = router;
