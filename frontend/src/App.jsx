/**
 * MAIN APP COMPONENT
 * 
 * This is the root component of the application
 * It sets up:
 * - React Router for navigation between pages
 * - Authentication context provider
 * - Route definitions (public and protected)
 * 
 * Route Structure:
 * - / : Redirects to dashboard or login based on auth status
 * - /login : Login page (public)
 * - /register : Registration page (public)
 * - /dashboard : Main dashboard (protected - requires authentication)
 */

// Import React Router components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import context providers
import { AuthProvider } from './context/AuthContext';

// Import components
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

/**
 * App Component
 * 
 * The root component that wraps the entire application
 */
function App() {
  return (
    /**
     * AuthProvider wraps the entire app
     * This makes authentication state available to all components
     */
    <AuthProvider>
      {/**
       * Router wraps route definitions
       * BrowserRouter uses HTML5 history API for clean URLs
       */}
      <Router>
        {/**
         * Routes container
         * Defines all the routes in the application
         */}
        <Routes>
          {/* ============================================ */}
          {/* HOME ROUTE */}
          {/* ============================================ */}

          {/**
           * Root route: /
           * Redirects to dashboard by default
           * If user is not authenticated, ProtectedRoute will redirect to login
           */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />

          {/* ============================================ */}
          {/* PUBLIC ROUTES */}
          {/* ============================================ */}

          {/**
           * Login route: /login
           * Public route - anyone can access
           */}
          <Route path="/login" element={<Login />} />

          {/**
           * Register route: /register
           * Public route - anyone can access
           */}
          <Route path="/register" element={<Register />} />

          {/* ============================================ */}
          {/* PROTECTED ROUTES */}
          {/* ============================================ */}

          {/**
           * Dashboard route: /dashboard
           * Protected route - requires authentication
           * ProtectedRoute component checks if user is logged in
           * If not logged in, redirects to /login
           */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ============================================ */}
          {/* CATCH-ALL ROUTE */}
          {/* ============================================ */}

          {/**
           * Catch-all route for undefined paths
           * Redirects to home page which will handle authentication
           */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
