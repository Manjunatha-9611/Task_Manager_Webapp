/**
 * TASK FORM COMPONENT
 * 
 * A reusable form for creating new tasks
 * 
 * Features:
 * - Title input (required)
 * - Description textarea (optional)
 * - Form validation
 * - Submit handling
 */

// Import React hooks
import { useState } from 'react';

/**
 * TaskForm Component
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback function when form is submitted
 */
const TaskForm = ({ onSubmit }) => {
    // ============================================
    // STATE MANAGEMENT
    // ============================================

    /**
     * Form data state
     * Stores the current values of title and description
     */
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    /**
     * Loading state
     * Shows when form is being submitted
     */
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle input changes
     * 
     * Updates form state as user types
     * Uses computed property name to update the correct field
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, // name can be 'title' or 'description'
        }));
    };

    /**
     * Handle form submission
     * 
     * Validates input and calls parent's onSubmit callback
     */
    const handleSubmit = async (e) => {
        // Prevent default form submission (page refresh)
        e.preventDefault();

        // Validation: Check if title is not empty
        if (!formData.title.trim()) {
            alert('Please enter a task title');
            return;
        }

        try {
            // Set loading state
            setIsSubmitting(true);

            // Call the parent's submit handler
            // Pass the form data to create the task
            await onSubmit(formData);

            // Clear form after successful submission
            setFormData({
                title: '',
                description: '',
            });
        } catch (error) {
            // Error is already handled by parent component
            console.error('Error submitting form:', error);
        } finally {
            // Reset loading state
            setIsSubmitting(false);
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="card">
            <h2>Add New Task</h2>

            <form onSubmit={handleSubmit}>
                {/* Title input field */}
                <div className="form-group">
                    <label htmlFor="title" className="form-label">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Enter task title..."
                        required
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description textarea */}
                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Add task description (optional)..."
                        disabled={isSubmitting}
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                >
                    {/* Show different text based on loading state */}
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
            </form>
        </div>
    );
};

export default TaskForm;
