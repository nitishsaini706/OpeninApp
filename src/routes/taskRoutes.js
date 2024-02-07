// TaskRoutes.js
const express = require('express');
const { createTask, createSubTask, getAllUserTasks, updateTask, deleteTask } = require('../controller/taskController');
const verifyToken  = require('../middleware/auth');

const router = express.Router();

router.post('/createTask', verifyToken, createTask);
router.post('/subtask', verifyToken, createSubTask);
router.get('/tasks', verifyToken, getAllUserTasks);
router.put('/task/:id', verifyToken, updateTask);
router.delete('/task/:id', verifyToken, deleteTask);

module.exports = router;
