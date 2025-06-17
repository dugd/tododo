const express = require('express');

const taskRouter = require('./api/tasks');
const userRouter = require('./api/users');
const authRouter = require('./api/auth');

const indexRouter = require('./pages/index');

const apiRouter = express.Router();
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/auth', authRouter);

apiRouter.use((err, req, res, next) => {
    const status = err.status || 500;

    console.error(err);

    res.status(status).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

const pagesRouter = express.Router();
pagesRouter.use('/', indexRouter);

module.exports = { apiRouter, pagesRouter: pagesRouter };
