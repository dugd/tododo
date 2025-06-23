const express = require('express');

const { authLocals } = require('../auth/middleware');

const taskRouter = require('./api/tasks');
const userRouter = require('./api/users');
const authRouter = require('./api/auth');

const tasksPageRouter = require('./pages/tasks');
const authPageRouter = require('./pages/auth');

const apiRouter = express.Router();
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

apiRouter.use((err, req, res, next) => {
    const status = err.status || 500;

    if (err.loggable ?? true) {
        console.error(err);
    }

    res.status(status).json({
        message: err.message || 'Internal Server Error',
    });
});

const pagesRouter = express.Router();
pagesRouter.use(authLocals);
pagesRouter.use('/', tasksPageRouter);
pagesRouter.use('/auth', authPageRouter);

module.exports = { apiRouter, pagesRouter: pagesRouter };
