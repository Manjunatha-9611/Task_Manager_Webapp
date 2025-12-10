/**
 * LOGIN PAGE
 * 
 * This page allows existing users to log in to their account
 * 
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Error message display
 * - Link to registration page for new users
 * - Automatic redirect to dashboard after successful login
 */

// Import React hooks and dependencies
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Login Component
 */
const Login = () => {
    // ============================================
    // HOOKS
    // ============================================

    /**
     * Get authentication functions from context
     * - login: function to authenticate user
     * - error: any error from auth context
     * - setError: function to clear errors
     */
    const { login, error, setError } = useAuth();

    /**
     * Navigation hook from React Router
     * Used to redirect user after successful login
     */
    const navigate = useNavigate();

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * Form data state
     * Stores email and password input values
     */
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    /**
     * Local error state
     * Stores validation errors
     */
    const [localError, setLocalError] = useState('');

    /**
     * Loading state
     * Shows when login request is in progress
     */
    const [loading, setLoading] = useState(false);

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle input changes
     * 
     * Updates form state as user types
     * Also clears any existing errors
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear errors when user starts typing
        setLocalError('');
        setError(null);
    };

    /**
     * Handle form submission
     * 
     * Validates input and attempts to log in user
     */
    const handleSubmit = async (e) => {
        // Prevent default form submission
        e.preventDefault();

        // Clear previous errors
        setLocalError('');
        setError(null);

        // Validation: Check if all fields are filled
        if (!formData.email || !formData.password) {
            setLocalError('Please fill in all fields');
            return;
        }

        // Email format validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        try {
            // Set loading state
            setLoading(true);

            // Attempt to login using auth context
            await login(formData.email, formData.password);

            // If successful, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Error is already set in auth context
            // Just need to reset loading state
            setLoading(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="container" style={{ paddingTop: '4rem' }}>
            <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                {/* Page title */}
                <div className="text-center mb-4">
                    <h1>Welcome Back!</h1>
                    <p className="text-secondary">Login to manage your tasks</p>
                </div>

                {/* Login form card */}
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        {/* Display errors if any */}
                        {(localError || error) && (
                            <div
                                className="mb-3"
                                style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid var(--danger-color)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--danger-color)',
                                }}
                            >
                                {localError || error}
                            </div>
                        )}

                        {/* Email input */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="you@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Password input */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Enter your password"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>

                        {/* Link to registration page */}
                        <p className="text-center mt-3 text-secondary">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Sign up here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
