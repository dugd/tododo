const Task = require('../models/task');

async function getAllTasks() {
    return Task.find();
}

async function getTaskById(id) {
    return Task.findById(id);
}

async function createTask(data) {
    const task = new Task(data);
    return task.save();
}

async function updateTask(id, data) {
    return Task.findByIdAndUpdate(id, data, { new: true });
}

async function toggleTask(id) {
    const task = await getTaskById(id);
    if (!task) return null;
    task.done = !task.done;
    return task.save();
}

async function deleteTask(id) {
    return Task.findByIdAndDelete(id);
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
}