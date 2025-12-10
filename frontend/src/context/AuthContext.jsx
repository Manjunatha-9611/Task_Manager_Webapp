/**
 * AUTHENTICATION CONTEXT
 * 
 * This file creates a React Context for managing authentication state globally
 * 
 * Context API allows us to share authentication state across all components
 * without having to pass props down through multiple levels (prop drilling)
 * 
 * This context provides:
 * - Current user data
 * - Login and logout functions
 * - Loading state
 * - Authentication status
 */

// Import React hooks and API functions
import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../services/api';

// ============================================
// CREATE CONTEXT
// ============================================

/**
 * Create the authentication context
 * This will hold the authentication state and methods
 */
const AuthContext = createContext();

// ============================================
// CONTEXT PROVIDER COMPONENT
// ============================================

/**
 * AuthProvider component
 * 
 * This component wraps the entire app and provides authentication state
 * to all child components
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * User state - stores the current logged-in user data
     * Initially tries to get user from localStorage (for persistence)
     */
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    /**
     * Loading state - shows if we're performing an auth operation
     * Useful for showing loading spinners during login/register
     */
    const [loading, setLoading] = useState(false);

    /**
     * Error state - stores any authentication errors
     */
    const [error, setError] = useState(null);

    // ============================================
    // AUTHENTICATION METHODS
    // ============================================

    /**
     * Login function
     * 
     * Authenticates user with backend and stores token
     * 
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<boolean>} Success status
     */
    const login = async (email, password) => {
        try {
            // Clear any previous errors
            setError(null);
            setLoading(true);

            // Call the backend API to authenticate
            const data = await loginAPI({ email, password });

            // Store token in localStorage for persistence
            // This allows user to stay logged in even after page refresh
            localStorage.setItem('token', data.token);

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));

            // Update user state
            setUser(data.user);

            setLoading(false);
            return true;
        } catch (err) {
            // Handle login errors
            setLoading(false);

            // Extract error message from response or use default
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);

            throw new Error(errorMessage);
        }
    };

    /**
     * Register function
     * 
     * Creates new user account and automatically logs them in
     * 
     * @param {string} username - User's username
     * @param {string} email - User's email
     * @param {string} password - User's password
     * @returns {Promise<boolean>} Success status
     */
    const register = async (username, email, password) => {
        try {
            setError(null);
            setLoading(true);

            // Call the backend API to create account
            const data = await registerAPI({ username, email, password });

            // Store token and user data (same as login)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Update user state
            setUser(data.user);

            setLoading(false);
            return true;
        } catch (err) {
            setLoading(false);

            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);

            throw new Error(errorMessage);
        }
    };

    /**
     * Logout function
     * 
     * Clears authentication data and logs user out
     */
    const logout = () => {
        // Clear all auth data from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Clear user state
        setUser(null);
        setError(null);
    };

    /**
     * Check if user is authenticated
     * 
     * @returns {boolean} True if user is logged in
     */
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    // ============================================
    // SIDE EFFECTS
    // ============================================

    /**
     * Effect to validate token on mount
     * 
     * This ensures that if user refreshes the page,
     * their authentication state is restored from localStorage
     */
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        // If we have a token and user data, restore the session
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                // If there's an error parsing user data, clear everything
                console.error('Error restoring user session:', err);
                logout();
            }
        }
    }, []); // Empty dependency array means this runs once on mount

    // ============================================
    // CONTEXT VALUE
    // ============================================

    /**
     * Value object that will be provided to all consumers
     * This contains all the state and methods that components can use
     */
    const value = {
        user,              // Current user object
        loading,           // Loading state
        error,             // Error message
        login,             // Login function
        register,          // Register function
        logout,            // Logout function
        isAuthenticated,   // Check auth status function
        setError,          // Allow components to clear errors
    };

    // ============================================
    // RENDER PROVIDER
    // ============================================

    /**
     * Render the provider component
     * All children will have access to the auth context
     */
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ============================================
// CUSTOM HOOK FOR USING AUTH CONTEXT
// ============================================

/**
 * useAuth hook
 * 
 * Custom hook to easily access auth context in any component
 * 
 * Usage in components:
 *   const { user, login, logout } = useAuth();
 * 
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    // Throw error if used outside of AuthProvider
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
