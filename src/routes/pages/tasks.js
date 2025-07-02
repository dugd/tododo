const express = require('express');
const mongoose = require('mongoose');
const taskService = require('../../services/task');
const { isAuthenticated } = require('../../auth/middleware');
const {
    createValidation,
    updateValidation,
} = require('../../validation/tasks');
const { validateView } = require('../../middlewares/validate');
const { sortQueries } = require('../../middlewares/query');

const router = express.Router();

router.use(isAuthenticated);

router.get('/', sortQueries, async (req, res) => {
    const { filter = 'active' } = req.query;
    let getTasks =
        {
            active: taskService.getActiveTasks,
            all: taskService.getAllTasks,
            overdue: taskService.getOverdueTasks,
        }[filter] ?? taskService.getActiveTasks;
    const tasks = await getTasks(req.user._id, req.sortObj);
    res.render('tasks/index', { tasks });
});

router
    .route('/add')
    .get((req, res) => {
        res.render('tasks/task-form', { task: null });
    })
    .post(createValidation, validateView('/tasks/add'), async (req, res) => {
        console.log(req.body);
        const { title, description, deadline, priority, subtasks } = req.body;

        const task = await taskService.createTask(
            {
                title,
                description,
                deadline: new Date(deadline),
                priority: parseInt(priority),
                subtasks: subtasks,
            },
            req.user._id
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
    .post(
        updateValidation,
        validateView((req) => `/tasks/edit/${req.id}`),
        validateView('/tasks/add'),
        async (req, res) => {
            const { title, description, deadline, priority, subtasks } =
                req.body;
            const id = req.id;

            try {
                const updated = await taskService.updateTask(
                    id,
                    {
                        title,
                        description,
                        deadline: new Date(deadline),
                        priority: parseInt(priority),
                        subtasks,
                    },
                    req.user._id
                );
                if (!updated) {
                    req.flash('error', 'Task not found');
                    return res.redirect('/tasks');
                }

                req.flash('success', 'Task is updated');
                res.redirect('/tasks');
            } catch (e) {
                console.error(e);
            }
        }
    );

router.post('/toggle/:id/:s_id', async (req, res) => {
    const task = await taskService.toggleSubtask(
        req.id,
        req.s_id,
        req.user._id
    );

    if (!task) {
        req.flash('error', 'Subtask not found');
        return res.redirect('/tasks');
    }

    res.redirect('/tasks');
});

router.post('/toggle/:id', async (req, res) => {
    const task = await taskService.toggleTask(req.id, req.user._id);
    if (!task) {
        req.flash('error', 'Task not found');
        return res.redirect('/tasks');
    }

    res.redirect('/tasks');
});

router.post('/delete/:id', async (req, res) => {
    const result = await taskService.deleteTask(req.id, req.user._id);
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

router.param('s_id', async (req, res, next, s_id) => {
    s_id = Number.parseInt(s_id);
    if (!Number.isInteger(s_id)) {
        req.flash('error', 'Invalid subtask ID format');
        return res.redirect('/tasks');
    } else {
        req.s_id = s_id;
        next();
    }
});

module.exports = router;
