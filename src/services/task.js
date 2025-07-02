const Task = require('../models/task');

async function getAllTasks(userId = null) {
    const filter = userId ? { userId } : {};
    return Task.find(filter);
}

async function getActiveTasks(userId = null) {
    const filter = { done: false };
    if (userId) filter.userId = userId;
    return Task.find(filter);
}

async function getOverdueTasks(userId = null) {
    const filter = { done: false };
    if (userId) filter.userId = userId;
    const tasks = await Task.find(filter);
    return tasks.filter((task) => task.overdue);
}

async function getTaskById(id, userId = null) {
    const filter = { _id: id };
    if (userId) filter.userId = userId;
    return Task.findOne(filter);
}

async function createTask(
    { title, description, deadline, priority, subtasks },
    userId
) {
    const task = new Task({
        title: title.trim(),
        description: description.trim() || null,
        deadline: deadline || null,
        priority: priority || undefined,
        subtasks: subtasks || [],
        userId,
    });
    return task.save();
}

async function updateTask(
    id,
    { title, done, description, deadline, priority, subtasks },
    userId
) {
    const filter = { _id: id, userId };
    const update = {
        title: title.trim(),
        done,
        description: description.trim() || null,
        deadline: deadline || null,
        priority: priority || undefined,
        subtasks: subtasks || [],
    };
    return Task.findOneAndUpdate(filter, update, { new: true });
}

async function toggleTask(id, userId) {
    const task = await getTaskById(id, userId);
    if (!task) return null;
    task.done = !task.done;
    return task.save();
}

async function toggleSubtask(id, index, userId) {
    const task = await getTaskById(id, userId);
    if (!task || index >= task.subtasks.length) return null;
    task.subtasks[index].done = !task.subtasks[index].done;
    return task.save();
}

async function deleteTask(id, userId) {
    const filter = { _id: id };
    if (userId) filter.userId = userId;
    return Task.findOneAndDelete(filter);
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
};
