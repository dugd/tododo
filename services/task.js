const Task = require('../models/task');

async function getAllTasks() {
    return Task.find();
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
    getActiveTasks,
    getOverdueTasks,
    getTaskById,
    createTask,
    updateTask,
    toggleTask,
    toggleSubtask,
    deleteTask,
}