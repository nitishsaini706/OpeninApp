// TaskModel.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    due_date: Date,
    priority: Number,
    status: String,
    user_id: mongoose.Schema.Types.ObjectId, // Reference to the user
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: Date,
    isDeleted: { type: Boolean, default: false }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
