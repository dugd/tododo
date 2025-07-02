const Task = require('../models/task');

async function getAllTasks(userId = null, sortObj = {}, pagination = {}) {
    const filter = userId ? { userId } : {};

    let query = Task.find(filter)
        .sort(sortObj)
        .skip(pagination.skip || 0);
    if (pagination.limit > 0) {
        query = query.limit(pagination.limit);
    }

    return query;
}

async function getActiveTasks(userId = null, sortObj = {}, pagination = {}) {
    const filter = { done: false };
    if (userId) filter.userId = userId;

    let query = Task.find(filter)
        .sort(sortObj)
        .skip(pagination.skip || 0);
    if (pagination.limit > 0) {
        query = query.limit(pagination.limit);
    }

    return query;
}

async function getOverdueTasks(userId = null, sortObj = {}, pagination = {}) {
    const filter = { done: false };
    if (userId) filter.userId = userId;

    let query = Task.find(filter)
        .sort(sortObj)
        .skip(pagination.skip || 0);
    if (pagination.limit > 0) {
        query = query.limit(pagination.limit);
    }

    const tasks = await query;
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
