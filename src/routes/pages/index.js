const express = require('express');
const flash = require('connect-flash');

const { authLocals } = require('../../auth/middleware');

const tasksRouter = require('./tasks');
const authRouter = require('./auth');

const pagesRouter = express.Router();

pagesRouter.use(flash());
pagesRouter.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

pagesRouter.use(authLocals);
pagesRouter.use('/auth', authRouter);
pagesRouter.use('/tasks', tasksRouter);

pagesRouter.use((err, req, res, next) => {
    const status = err.status || 500;
    console.error(err);

    if (err.loggable ?? true) {
        console.error(err);
    }

    if (status === 401) {
        req.flash('error', 'Not authorized');
        return res.redirect('/auth/login');
    }

    res.status(status).render('error', {
        message: err.message || 'Internal server Error',
    });
});

pagesRouter.get('/', (req, res) => {
    res.redirect('/tasks');
});

pagesRouter.use((req, res) => {
    res.status(404).render('error', {
        message: 'page does not exists',
    });
});

module.exports = pagesRouter;
