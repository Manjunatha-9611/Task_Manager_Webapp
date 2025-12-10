/**
 * TASK ITEM COMPONENT
 * 
 * Displays a single task with:
 * - Task title and description
 * - Checkbox to mark complete/incomplete
 * - Edit button to modify task
 * - Delete button to remove task
 * - Visual styling based on completion status
 * 
 * This is a reusable component used in the Dashboard
 */

// Import React hooks
import { useState } from 'react';

/**
 * TaskItem Component
 * 
 * @param {Object} props
 * @param {Object} props.task - The task object to display
 * @param {Function} props.onUpdate - Callback when task is updated
 * @param {Function} props.onDelete - Callback when task is deleted
 */
const TaskItem = ({ task, onUpdate, onDelete }) => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * Edit mode state
     * When true, shows input fields to edit the task
     * When false, shows task details
     */
    const [isEditing, setIsEditing] = useState(false);

    /**
     * Edit form state
     * Stores the current values of title and description while editing
     */
    const [editForm, setEditForm] = useState({
        title: task.title,
        description: task.description || '',
    });

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle toggling task completion status
     * 
     * When checkbox is clicked, update the task's completed status
     */
    const handleToggleComplete = () => {
        onUpdate(task._id, { completed: !task.completed });
    };

    /**
     * Handle input changes in edit mode
     * 
     * Updates the editForm state as user types
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /**
     * Handle saving edited task
     * 
     * Sends updated data to parent component and exits edit mode
     */
    const handleSave = (e) => {
        e.preventDefault();

        // Basic validation - title is required
        if (!editForm.title.trim()) {
            alert('Task title is required');
            return;
        }

        // Call the update callback with new data
        onUpdate(task._id, editForm);

        // Exit edit mode
        setIsEditing(false);
    };

    /**
     * Handle canceling edit
     * 
     * Resets form to original values and exits edit mode
     */
    const handleCancel = () => {
        // Reset form to original task data
        setEditForm({
            title: task.title,
            description: task.description || '',
        });

        // Exit edit mode
        setIsEditing(false);
    };

    /**
     * Handle deleting task
     * 
     * Confirms with user before deleting
     */
    const handleDelete = () => {
        // Ask for confirmation before deleting
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete(task._id);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="card fade-in">
            {/* Show edit form if in edit mode, otherwise show task details */}
            {isEditing ? (
                // ====== EDIT MODE ======
                <form onSubmit={handleSave}>
                    {/* Title input */}
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={editForm.title}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Description textarea */}
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            value={editForm.description}
                            onChange={handleInputChange}
                            className="form-textarea"
                            placeholder="Add a description..."
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary btn-sm">
                            Save
                        </button>
                        <button type="button" onClick={handleCancel} className="btn btn-secondary btn-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                // ====== VIEW MODE ======
                <>
                    {/* Task header with checkbox and actions */}
                    <div className="flex justify-between items-center mb-3">
                        {/* Checkbox to mark complete/incomplete */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={handleToggleComplete}
                                className="form-checkbox"
                            />
                            {/* Title - strike through if completed */}
                            <h3
                                style={{
                                    textDecoration: task.completed ? 'line-through' : 'none',
                                    opacity: task.completed ? 0.6 : 1,
                                }}
                            >
                                {task.title}
                            </h3>
                        </div>

                        {/* Action buttons: Edit and Delete */}
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                                Edit
                            </button>
                            <button onClick={handleDelete} className="btn btn-danger btn-sm">
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Task description (if exists) */}
                    {task.description && (
                        <p
                            className="text-secondary"
                            style={{
                                opacity: task.completed ? 0.6 : 1,
                            }}
                        >
                            {task.description}
                        </p>
                    )}

                    {/* Task metadata: Created date and status badge */}
                    <div className="flex gap-3 mt-3 text-sm text-muted">
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        <span className={task.completed ? 'text-success' : 'text-warning'}>
                            {task.completed ? '✓ Completed' : '○ In Progress'}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default TaskItem;
