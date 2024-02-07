// SubTaskModel.js
const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    status: Number,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: Date,
});

const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask;