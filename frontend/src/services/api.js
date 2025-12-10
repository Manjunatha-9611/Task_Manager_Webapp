/**
 * API SERVICE LAYER
 * 
 * This file centralizes all API calls to the backend
 * It provides a clean interface for authentication and task management
 * 
 * Benefits:
 * - Single place to configure API settings
 * - Automatic JWT token inclusion in requests
 * - Centralized error handling
 * - Easy to maintain and test
 */

// Import axios for HTTP requests
import axios from 'axios';

// ============================================
// AXIOS INSTANCE CONFIGURATION
// ============================================

/**
 * Create a custom axios instance with base configuration
 * This instance will be used for all API calls
 */
const api = axios.create({
    // Base URL from environment variable
    // All requests will be prefixed with this URL
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

    // Default headers for all requests
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * REQUEST INTERCEPTOR
 * 
 * This runs before every request is sent
 * It automatically adds the JWT token to the Authorization header
 * This way we don't have to manually add the token to each request
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the Authorization header
        // Format: "Bearer <token>"
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * This runs after every response is received
 * It handles common errors like expired tokens
 */
api.interceptors.response.use(
    (response) => {
        // If response is successful, just return it
        return response;
    },
    (error) => {
        // Check if error is due to unauthorized access (401)
        if (error.response && error.response.status === 401) {
            // Token might be expired or invalid
            // Clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// ============================================
// AUTHENTICATION API CALLS
// ============================================

/**
 * Register a new user
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise} Response with token and user data
 */
export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

/**
 * Login user
 * 
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email address
 * @param {string} credentials.password - Password
 * @returns {Promise} Response with token and user data
 */
export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

// ============================================
// TASK API CALLS
// ============================================

/**
 * Get all tasks for the authenticated user
 * 
 * @returns {Promise} Array of tasks
 */
export const getTasks = async () => {
    const response = await api.get('/tasks');
    return response.data;
};

/**
 * Create a new task
 * 
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} taskData.description - Task description (optional)
 * @returns {Promise} Created task object
 */
export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

/**
 * Update an existing task
 * 
 * @param {string} id - Task ID
 * @param {Object} taskData - Updated task data
 * @returns {Promise} Updated task object
 */
export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

/**
 * Delete a task
 * 
 * @param {string} id - Task ID
 * @returns {Promise} Success message
 */
export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

// Export the configured axios instance for custom requests if needed
export default api;
