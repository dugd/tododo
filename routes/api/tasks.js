const express = require('express');
const Task = require('../../models/task')

const router = express.Router();


router.route('/')
    .get(async (req, res) => {
        const tasks = await Task.find();
        res.json(tasks);
    })
    .post(async (req, res) => {
        const { title } = req.body;
        if (!title) return res.status(400).json({error: 'title is required'});

        const task = new Task({ title });
        await task.save();
        res.status(201).json(task);
    })

router.route("/:id")
    .get(async (req, res) => {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Not found' });
        res.json(task);
    })
    .put(async (req, res) => {
        const { title, done } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Not found' });

        if (title !== undefined) task.title = title;
        if (done !== undefined) task.done = done;

        await task.save();
        res.json(task);
    })
    .delete(async (req, res) => {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Not found' });
        res.status(204).end();
    })


module.exports = router;