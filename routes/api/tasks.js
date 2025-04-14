const express = require('express');
const mongoose = require("mongoose");
const taskService = require('../../services/task');
const { createValidation, updateValidation } = require('../../validation/tasks');

const router = express.Router();


router.route('/')
    .get(async (req, res) => {
        const tasks = await taskService.getAllTasks();
        res.json(tasks);
    })
    .post([createValidation, async (req, res) => {
        const data = req.body;

        try {
            const task = await taskService.createTask(data);
            res.status(201).json(task);
        } catch (e) {
            res.status(400).json({message: e.message});
        }
    }])

router.route("/:id")
    .get(async (req, res) => {
        const task = await taskService.getTaskById(req.id);
        if (!task) return res.status(404).json({ message: 'Not found' });
        res.json(task);
    })
    .put([updateValidation, async (req, res) => {

        const task = await taskService.updateTask(req.id, data);
        if (!task) return res.status(404).json({ message: 'Not found' });

        res.json(task);
    }])
    .delete(async (req, res) => {
        const result = await taskService.deleteTask(req.id);
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.status(204).end();
    })

router.post('/:id/toggle', async (req, res) => {
    const task = await taskService.toggleTask(req.id);
    if (!task) return res.status(404).json({ message: 'Not found' });

    res.json(task.done);
});

router.param('id', async (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid ID format' });
    }
    req.id = id;
    next();
})


module.exports = router;