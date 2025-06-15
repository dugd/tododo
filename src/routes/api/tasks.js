const express = require('express');
const mongoose = require('mongoose');
const { isAuthenticated } = require('../../auth/middleware');
const taskService = require('../../services/task');
const {
    createValidation,
    updateValidation,
} = require('../../validation/tasks');

const router = express.Router();

router.use(isAuthenticated);

router
    .route('/')
    .get(async (req, res) => {
        const tasks = await taskService.getAllTasks(req.user._id);
        res.json(tasks);
    })
    .post(createValidation, async (req, res) => {
        const {
            data: { title, description, deadline, priority, subtasks },
        } = req.body;

        try {
            const task = await taskService.createTask(data, req.user._id);
            res.status(201).json(task);
        } catch (e) {
            res.status(400).json({ message: e.message });
        }
    });

router.get('/active', async (req, res) => {
    const tasks = await taskService.getActiveTasks(req.user._id);
    res.json(tasks);
});

router.get('/overdue', async (req, res) => {
    const tasks = await taskService.getOverdueTasks(req.user._id);
    res.json(tasks);
});

router
    .route('/:id')
    .get(async (req, res) => {
        const task = await taskService.getTaskById(req.id, req.user._id);
        if (!task) return res.status(404).json({ message: 'Not found' });
        res.json(task);
    })
    .put(updateValidation, async (req, res) => {
        const data = req.body;

        const task = await taskService.updateTask(req.id, data, req.user._id);
        if (!task) return res.status(404).json({ message: 'Not found' });

        res.json(task);
    })
    .delete(async (req, res) => {
        const result = await taskService.deleteTask(req.id, req.user._id);
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.status(204).end();
    });

router.post('/:id/toggle', async (req, res) => {
    const task = await taskService.toggleTask(req.id, req.user._id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    else res.json(task);
});

router.post('/:id/:s_id/toggle', async (req, res) => {
    const task = await taskService.toggleSubtask(
        req.id,
        req.s_id,
        req.user._id
    );
    if (!task) return res.status(404).json({ message: 'Not found' });
    else res.json(task);
});

router.param('id', async (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid ID format' });
    } else {
        req.id = id;
        next();
    }
});

router.param('s_id', async (req, res, next, s_id) => {
    s_id = Number.parseInt(s_id);
    if (!Number.isInteger(s_id)) {
        res.status(400).json({ message: 'Invalid subtask ID format' });
    } else {
        req.s_id = s_id;
        next();
    }
});

module.exports = router;
