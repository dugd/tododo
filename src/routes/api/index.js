const express = require('express');

const taskRouter = require('./tasks');
const userRouter = require('./users');
const authRouter = require('./auth');

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

module.exports = apiRouter;
