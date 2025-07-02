const express = require('express');
const flash = require('connect-flash');

const { authLocals } = require('../../auth/middleware');
const { apiErrorHandler } = require('../../middlewares/error');

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

pagesRouter.use(apiErrorHandler);

pagesRouter.get('/', (req, res) => {
    res.redirect('/tasks');
});

pagesRouter.use((req, res) => {
    res.status(404).render('error', {
        message: 'page does not exists',
    });
});

module.exports = pagesRouter;
