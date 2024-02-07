// taskController.js
const Task = require('../models/TaskModel');
const SubTask = require('../models/SubTaskModel');

// Controller to create a task
const createTask = async (req, res) => {
    try {
        const { title, description, due_date } = req.body;
        const newTask = new Task({
            title,
            description,
            due_date,
            user_id: req.user.id, // Assuming the user ID is attached to the request by the auth middleware
            status: 'TODO', // Default status
            // Set the priority based on the due_date here
        });

        // Save the task to the database
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

// Controller to create a subtask
const createSubTask = async (req, res) => {
    try {
        const { task_id } = req.body;
        const newSubTask = new SubTask({
            task_id,
            status: 0, // Default status for incomplete
        });

        // Save the subtask to the database
        await newSubTask.save();
        res.status(201).json(newSubTask);
    } catch (error) {
        res.status(500).json({ message: 'Error creating subtask', error: error.message });
    }
};

// Controller to get all user tasks
const getAllUserTasks = async (req, res) => {
    try {
        const { priority, due_date } = req.query;
        // Add pagination logic here
        const queryOptions = {
            user_id: req.user.id,
            ...(priority && { priority: priority }),
            ...(due_date && { due_date: { $lte: due_date } }), // Example filter based on due_date
        };

        const tasks = await Task.find(queryOptions);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks', error: error.message });
    }
};

// Controller to update a task
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { due_date, status } = req.body;

        // Find the task and update it
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { due_date, status },
            { new: true }
        );

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

// Controller to softly delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete by setting the deleted_at timestamp
        const deletedTask = await Task.findByIdAndUpdate(
            id,
            { deleted_at: new Date(),isDeleted:true },
            
        );

        res.json(deletedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

module.exports = {
    createTask,
    createSubTask,
    getAllUserTasks,
    updateTask,
    deleteTask
};
