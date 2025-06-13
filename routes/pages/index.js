const express = require('express');
const mongoose = require('mongoose');
const taskService = require('../../services/task');

const router = express.Router();

router.get('/', async (req, res) => {
    const tasks = await taskService.getAllTasks();
    res.render('index', { tasks });
});

router.post('/add', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: 'title is required' });

    const task = await taskService.createTask({ title });

    res.redirect('/');
});

router.post('/toggle/:id', async (req, res) => {
    const task = await taskService.toggleTask(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });

    res.redirect('/');
});

router.post('/delete/:id', async (req, res) => {
    const result = await taskService.deleteTask(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });

    res.redirect('/');
});

router.post('/edit/:id', async (req, res) => {
    const { title } = req.body;
    const id = req.id;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        await taskService.updateTask(id, { title: title.trim() });
        res.redirect('/');
    } catch (e) {
        console.error(e);
    }
});

router.param('id', (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid ID format' });
    }
    req.id = id;
    next();
});

module.exports = router;
