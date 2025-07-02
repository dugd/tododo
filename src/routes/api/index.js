const express = require('express');

const { apiErrorHandler } = require('../../middlewares/error');

const taskRouter = require('./tasks');
const authRouter = require('./auth');

const apiRouter = express.Router();

apiRouter.use('/tasks', taskRouter);
apiRouter.use('/auth', authRouter);

apiRouter.use(apiErrorHandler);

module.exports = apiRouter;
