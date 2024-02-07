require('dotenv').config();
const cron = require('node-cron');
const mongoose = require('mongoose');
const twilio = require('twilio');
const Task = require('./models/TaskModel'); // Make sure you have this model defined
const User = require('./models/UserModel'); // Make sure you have this model defined

// Initialize Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Cron job to update the priority of tasks based on due_date
cron.schedule('* * * * *', async () => {
    const tasks = await Task.find({}); // Fetch all tasks

    tasks.forEach(async (task) => {
        const dueDate = new Date(task.due_date);
        const today = new Date();
        let priority;

        // Calculate the difference in days
        const diffTime = Math.abs(dueDate - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Determine priority based on the difference in days
        if (diffDays === 0) priority = 0;
        else if (diffDays >= 1 && diffDays <= 2) priority = 1;
        else if (diffDays >= 3 && diffDays <= 4) priority = 2;
        else priority = 3;

        // Update task priority
        if (task.priority !== priority) {
            await Task.findByIdAndUpdate(task._id, { priority });
        }
    });
});

// Cron job for voice calling using Twilio if a task passes its due_date
cron.schedule('* * * * *', async () => {
    // Get all tasks that are past due date and not yet completed
    const overdueTasks = await Task.find({
        due_date: { $lt: new Date() },
        status: { $ne: 'DONE' }
    }).populate('user_id');

    // Group overdue tasks by user priority
    const tasksGroupedByPriority = overdueTasks.reduce((acc, task) => {
        const priority = task.user_id.priority;
        if (!acc[priority]) acc[priority] = [];
        acc[priority].push(task);
        return acc;
    }, {});

    // Sort groups by priority and call each user
    const priorities = Object.keys(tasksGroupedByPriority).sort();
    for (let priority of priorities) {
        const tasks = tasksGroupedByPriority[priority];

        for (let task of tasks) {
            const userPhone = task.user_id.phone_number;
            try {
                // Call the user using Twilio
                const call = await twilioClient.calls.create({
                    to: userPhone,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    url: 'http://twimlets.com/holdmusic?Bucket=com.twilio.music.ambient'
                });

                console.log(`Calling user ${task.user_id}: ${call.sid}`);
                break; // Break after the first call, assuming that's the requirement
            } catch (error) {
                console.error(`Error calling user ${task.user_id}:`, error.message);
            }
        }
    }
});

console.log('Cron jobs have been initialized.');
