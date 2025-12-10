/**
 * PROTECTED ROUTE COMPONENT
 * 
 * This component wraps routes that require authentication
 * It checks if user is logged in:
 * - If YES: renders the protected content
 * - If NO: redirects to login page
 * 
 * This ensures that only authenticated users can access certain pages
 */

// Import necessary dependencies
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component/page to protect
 * @returns {React.ReactNode} Either the protected content or redirect to login
 */
const ProtectedRoute = ({ children }) => {
    // Get authentication status from context
    const { isAuthenticated } = useAuth();

    /**
     * Check if user is authenticated
     * 
     * If not authenticated:
     *   - Navigate to login page
     *   - replace: true means the login page replaces current page in history
     *     (user can't press back button to get to protected page)
     * 
     * If authenticated:
     *   - Render the protected content (children)
     */
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated, render the protected content
    return children;
};

export default ProtectedRoute;
