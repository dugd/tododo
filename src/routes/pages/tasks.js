const express = require('express');
const mongoose = require('mongoose');
const taskService = require('../../services/task');
const { isAuthenticated } = require('../../auth/middleware');

const router = express.Router();

router.use(isAuthenticated);

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
        if (!title) {
            req.flash('error', 'Title is required');
            return res.redirect('/tasks/add');
        }

        const task = await taskService.createTask(
            {
                title: title.trim(),
                description: description.trim(),
                deadline: Date.parse(deadline),
                priority: parseInt(priority),
            }
            // userId from session
        );

        req.flash('success', 'Task is created');
        res.redirect('/tasks');
    });

router
    .route('/edit/:id')
    .get(async (req, res) => {
        const id = req.id;
        const task = await taskService.getTaskById(id);
        if (!task) {
            req.flash('error', 'Task not found');
            return res.redirect('/tasks');
        }
        res.render('tasks/task-form', { task });
    })
    .post(async (req, res) => {
        const { title, description, deadline, priority } = req.body;
        const id = req.id;
        console.log(req.body);

        if (!title) {
            req.flash('error', 'Title is required');
            return res.redirect(`/tasks/edit/${req.id}`);
        }

        try {
            const updated = await taskService.updateTask(
                id,
                {
                    title: title.trim(),
                    description: description.trim(),
                    deadline: deadline ? Date.parse(deadline) : undefined,
                    priority: parseInt(priority),
                }
                // userId from session
            );
            req.flash('success', 'Task is updated');
            res.redirect('/tasks');
        } catch (e) {
            console.error(e);
        }
    });

router.post('/toggle/:id', async (req, res) => {
    const task = await taskService.toggleTask(req.id);
    if (!task) {
        req.flash('error', 'Task not found');
        return res.redirect('/tasks');
    }

    res.redirect('/tasks');
});

router.post('/delete/:id', async (req, res) => {
    const result = await taskService.deleteTask(req.id);
    if (!result) {
        req.flash('error', 'Task not found');
        return res.redirect('/tasks');
    }

    req.flash('success', 'Task is deleted');
    res.redirect('/tasks');
});

router.param('id', (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid task ID format');
        return res.redirect('/tasks');
    }
    req.id = id;
    next();
});

module.exports = router;
