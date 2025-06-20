const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const taskService = require('../../services/task');

const router = express.Router();

router.get('/', async (req, res) => {
    const tasks = await taskService.getAllTasks();
    res.render('tasks/index', { tasks });
});

router
    .route('/add')
    .get((req, res) => {
        res.render('tasks/task-form', { task: null });
    })
    .post(async (req, res) => {
        const { title, description, deadline, priority } = req.body;
        if (!title)
            return res.status(400).json({ message: 'Title is required' });

        const task = await taskService.createTask(
            {
                title: title.trim(),
                description: description.trim(),
                deadline: Date.parse(deadline),
                priority: parseInt(priority),
            }
            // userId from session
        );

        res.redirect('/');
    });

router
    .route('/edit/:id')
    .get(async (req, res) => {
        const id = req.id;
        const task = await taskService.getTaskById(id);
        if (!task) return res.status(404).json({ message: 'Not found' });
        res.render('tasks/task-form', { task });
    })
    .post(async (req, res) => {
        const { title, description, deadline, priority } = req.body;
        const id = req.id;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        try {
            const updated = await taskService.updateTask(
                id,
                {
                    title: title.trim(),
                    description: description.trim(),
                    deadline: Date.parse(deadline),
                    priority: parseInt(priority),
                }
                // userId from session
            );
            res.redirect('/');
        } catch (e) {
            console.error(e);
        }
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

router
    .route('/login')
    .get((req, res) => {
        res.render('auth/login');
    })
    .post(
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })
    );

router.param('id', (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid ID format' });
    }
    req.id = id;
    next();
});

module.exports = router;
