/**
 * REGISTER PAGE
 * 
 * This page allows new users to create an account
 * 
 * Features:
 * - Username, email, and password input fields
 * - Form validation (password length, email format, etc.)
 * - Error message display
 * - Link to login page for existing users
 * - Automatic redirect to dashboard after successful registration
 */

// Import React hooks and dependencies
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Register Component
 */
const Register = () => {
    // ============================================
    // HOOKS
    // ============================================

    /**
     * Get authentication functions from context
     */
    const { register, error, setError } = useAuth();

    /**
     * Navigation hook for redirecting after registration
     */
    const navigate = useNavigate();

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * Form data state
     */
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '', // Extra field to confirm password
    });

    /**
     * Local error state for validation
     */
    const [localError, setLocalError] = useState('');

    /**
     * Loading state
     */
    const [loading, setLoading] = useState(false);

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle input changes
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
     * Handle form submission with validation
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setLocalError('');
        setError(null);

        // ============================================
        // VALIDATION
        // ============================================

        // Check if all fields are filled
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setLocalError('Please fill in all fields');
            return;
        }

        // Username length validation
        if (formData.username.length < 3) {
            setLocalError('Username must be at least 3 characters long');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setLocalError('Please enter a valid email address');
            return;
        }

        // Password length validation
        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return;
        }

        // Password confirmation validation
        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        // ============================================
        // REGISTRATION
        // ============================================

        try {
            setLoading(true);

            // Attempt to register using auth context
            await register(formData.username, formData.email, formData.password);

            // If successful, redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            // Error is already set in auth context
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
                    <h1>Create Account</h1>
                    <p className="text-secondary">Sign up to start managing your tasks</p>
                </div>

                {/* Registration form card */}
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

                        {/* Username input */}
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Choose a username"
                                required
                                disabled={loading}
                            />
                        </div>

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
                                placeholder="Create a password (min 6 characters)"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Confirm Password input */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Re-enter your password"
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
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>

                        {/* Link to login page */}
                        <p className="text-center mt-3 text-secondary">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: 'var(--primary-color)',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
