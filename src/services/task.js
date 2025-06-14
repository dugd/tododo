const Task = require('../models/task');

async function getAllTasks() {
    return Task.find();
}

async function getUserTasks(userId) {
    return Task.find({ userId });
}

async function getActiveTasks() {
    return Task.find({ done: false });
}

async function getOverdueTasks() {
    let tasks = await Task.find({ done: false });
    tasks = tasks.filter((task) => task.overdue);
    return tasks;
}

async function getTaskById(id) {
    return Task.findById(id);
}

async function createTask(
    { title, description, deadline, priority, subtasks },
    userId
) {
    const task = new Task({
        title,
        description,
        deadline,
        priority,
        subtasks,
        userId,
    });
    return task.save();
}

async function updateTask(
    id,
    { title, done, description, deadline, priority, subtasks }
) {
    return Task.findByIdAndUpdate(
        id,
        { title, done, description, deadline, priority, subtasks },
        { new: true }
    );
}

async function toggleTask(id) {
    const task = await getTaskById(id);
    if (!task) return null;
    task.done = !task.done;
    return task.save();
}

async function toggleSubtask(id, index) {
    const task = await getTaskById(id);
    if (!task) return null;
    if (index >= task.subtasks.length) return null;
    task.subtasks[index].done = !task.subtasks[index].done;
    return task.save();
}

async function deleteTask(id) {
    return Task.findByIdAndDelete(id);
}

module.exports = {
    getAllTasks,
    getUserTasks,
    getActiveTasks,
    getOverdueTasks,
    getTaskById,
    createTask,
    updateTask,
    toggleTask,
    toggleSubtask,
    deleteTask,
};
