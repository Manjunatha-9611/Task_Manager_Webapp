// Import required modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

/**
 * AUTHENTICATION ROUTES
 * 
 * This file handles user registration and login
 * Both routes are public (no authentication required)
 */

// ============================================
// POST /api/auth/register
// Register a new user
// Public route (no authentication required)
// ============================================
router.post(
    '/register',
    [
        // Validation middleware using express-validator
        // These checks run before the route handler
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Return first error message to keep response simple
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            // Extract data from request body
            const { username, email, password } = req.body;

            // Check if user already exists with this email
            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: 'User already exists with this email' });
            }

            // Check if username is already taken
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            // Hash the password before saving to database
            // Never store plain text passwords!
            // Salt rounds (10) determines how secure the hash is (higher = more secure but slower)
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user in database
            const user = await User.create({
                username,
                email,
                password: hashedPassword
            });

            // Generate JWT token for automatic login after registration
            // Token contains user ID and expires in 30 days
            const token = jwt.sign(
                { id: user._id },                    // Payload: user ID
                process.env.JWT_SECRET,              // Secret key from .env
                { expiresIn: '30d' }                 // Token expiration time
            );

            // Send success response with user data and token
            res.status(201).json({
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error during registration' });
        }
    }
);

// ============================================
// POST /api/auth/login
// Authenticate user and return token
// Public route
// ============================================
router.post(
    '/login',
    [
        // Validation middleware
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ],
    async (req, res) => {
        try {
            // Check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });

            // Check if user exists
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare provided password with hashed password in database
            // bcrypt.compare handles the hashing and comparison
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                // Use same error message for security (don't reveal which part is wrong)
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token for authenticated session
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            // Send success response with token and user data
            res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error during login' });
        }
    }
);

// Export router to be used in server.js
module.exports = router;
