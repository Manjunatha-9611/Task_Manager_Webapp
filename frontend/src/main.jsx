/**
 * MAIN ENTRY POINT
 * 
 * This is the entry point for the React application
 * It:
 * 1. Imports global styles
 * 2. Imports the root App component
 * 3. Renders the App into the DOM
 * 
 * The app is mounted to the #root element in index.html
 */

// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import global styles
// This includes our design system and CSS variables
import './index.css';

// Import the root App component
import App from './App.jsx';

/**
 * Create root and render the application
 * 
 * ReactDOM.createRoot creates a concurrent mode root
 * This enables React 18's new features
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  /**
   * StrictMode is a development tool
   * It activates additional checks and warnings
   * - Identifies unsafe lifecycles
   * - Warns about deprecated APIs
   * - Detects unexpected side effects
   * 
   * StrictMode only runs in development, not production
   */
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
