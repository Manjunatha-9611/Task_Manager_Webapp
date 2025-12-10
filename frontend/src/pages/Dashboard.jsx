/**
 * DASHBOARD PAGE
 * 
 * This is the main page of the application where users can:
 * - View all their tasks
 * - Create new tasks
 * - Edit existing tasks
 * - Delete tasks
 * - Mark tasks as complete/incomplete
 * - Logout
 * 
 * This page is PROTECTED - only authenticated users can access it
 */

// Import React hooks and dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

/**
 * Dashboard Component
 */
const Dashboard = () => {
    // ============================================
    // HOOKS
    // ============================================

    /**
     * Get current user and logout function from auth context
     */
    const { user, logout } = useAuth();

    /**
     * Navigation hook (currently not used but can be for future features)
     */
    const navigate = useNavigate();

    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * Tasks array state
     * Stores all tasks fetched from the backend
     */
    const [tasks, setTasks] = useState([]);

    /**
     * Loading state
     * Shows when tasks are being fetched
     */
    const [loading, setLoading] = useState(true);

    /**
     * Error state
     * Stores any errors that occur during task operations
     */
    const [error, setError] = useState(null);

    // ============================================
    // SIDE EFFECTS
    // ============================================

    /**
     * useEffect: Fetch tasks when component mounts
     * 
     * This runs once when the Dashboard is first loaded
     * It fetches all tasks for the authenticated user from the backend
     */
    useEffect(() => {
        fetchTasks();
    }, []); // Empty dependency array = run once on mount

    // ============================================
    // DATA FETCHING
    // ============================================

    /**
     * Fetch all tasks from the backend
     * 
     * This is called on component mount and can be called again to refresh tasks
     */
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            // Call API to get tasks
            const data = await getTasks();

            // Update tasks state
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to load tasks. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ============================================
    // TASK OPERATIONS
    // ============================================

    /**
     * Handle creating a new task
     * 
     * @param {Object} taskData - New task data (title, description)
     */
    const handleCreateTask = async (taskData) => {
        try {
            // Call API to create task
            const newTask = await createTask(taskData);

            // Add new task to the beginning of the tasks array
            // This shows newest tasks first
            setTasks((prevTasks) => [newTask, ...prevTasks]);

            // Show success feedback
            console.log('Task created successfully');
        } catch (err) {
            console.error('Error creating task:', err);
            alert(err.response?.data?.message || 'Failed to create task');
            throw err; // Re-throw so TaskForm can handle it
        }
    };

    /**
     * Handle updating a task
     * 
     * @param {string} taskId - ID of task to update
     * @param {Object} updates - Updated task data
     */
    const handleUpdateTask = async (taskId, updates) => {
        try {
            // Call API to update task
            const updatedTask = await updateTask(taskId, updates);

            // Update the task in the local state
            // Map through tasks and replace the updated one
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                )
            );

            console.log('Task updated successfully');
        } catch (err) {
            console.error('Error updating task:', err);
            alert(err.response?.data?.message || 'Failed to update task');
        }
    };

    /**
     * Handle deleting a task
     * 
     * @param {string} taskId - ID of task to delete
     */
    const handleDeleteTask = async (taskId) => {
        try {
            // Call API to delete task
            await deleteTask(taskId);

            // Remove task from local state
            // Filter out the deleted task
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task._id !== taskId)
            );

            console.log('Task deleted successfully');
        } catch (err) {
            console.error('Error deleting task:', err);
            alert(err.response?.data?.message || 'Failed to delete task');
        }
    };

    // ============================================
    // AUTH OPERATIONS
    // ============================================

    /**
     * Handle user logout
     * 
     * Clears authentication and redirects to login page
     */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Header with welcome message and logout button */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1>Task Dashboard</h1>
                    <p className="text-secondary">
                        Welcome back, <span style={{ color: 'var(--primary-color)' }}>{user?.username}</span>!
                    </p>
                </div>

                <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                </button>
            </div>

            {/* Task creation form */}
            <div className="mb-4">
                <TaskForm onSubmit={handleCreateTask} />
            </div>

            {/* Tasks section */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2>Your Tasks ({tasks.length})</h2>

                    {/* Refresh button */}
                    <button onClick={fetchTasks} className="btn btn-secondary btn-sm" disabled={loading}>
                        {loading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid var(--danger-color)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--danger-color)',
                            marginBottom: 'var(--spacing-lg)',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Loading state */}
                {loading ? (
                    <div className="text-center" style={{ padding: 'var(--spacing-2xl)' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                        <p className="mt-3 text-secondary">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    /* Empty state - no tasks */
                    <div className="card text-center">
                        <h3>No tasks yet</h3>
                        <p className="text-secondary">
                            Create your first task above to get started!
                        </p>
                    </div>
                ) : (
                    /* Task list */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {tasks.map((task) => (
                            <TaskItem
                                key={task._id}
                                task={task}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Task stats */}
            {tasks.length > 0 && (
                <div className="card mt-4">
                    <h3>Statistics</h3>
                    <div className="flex gap-4">
                        <div>
                            <p className="text-muted">Total Tasks</p>
                            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold' }}>
                                {tasks.length}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted">Completed</p>
                            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--success-color)' }}>
                                {tasks.filter((t) => t.completed).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted">In Progress</p>
                            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--warning-color)' }}>
                                {tasks.filter((t) => !t.completed).length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
