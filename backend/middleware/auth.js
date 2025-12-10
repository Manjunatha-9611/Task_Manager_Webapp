// Import jsonwebtoken to verify JWT tokens
const jwt = require('jsonwebtoken');
// Import User model to fetch user data
const User = require('../models/User');

/**
 * Authentication Middleware
 * 
 * Purpose: Protect routes that require user authentication
 * 
 * How it works:
 * 1. Extracts JWT token from Authorization header
 * 2. Verifies the token is valid and not expired
 * 3. Finds the user in database using the ID from token
 * 4. Attaches user object to request for use in route handlers
 * 5. Calls next() to proceed to the actual route handler
 * 
 * If any step fails, returns 401 Unauthorized error
 */
const protect = async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    // Format: "Authorization: Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from header
            // Split "Bearer token" and take the second part (the actual token)
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the same secret key used to create it
            // This returns the decoded payload (containing user ID)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user in database using ID from token
            // .select('-password') excludes the password field from the result
            // We attach the user object to req so routes can access it
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user exists (might have been deleted)
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // User is authenticated, proceed to the route handler
            next();
        } catch (error) {
            // Token verification failed (invalid or expired)
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        // No token provided in request
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Export the middleware function
module.exports = { protect };
