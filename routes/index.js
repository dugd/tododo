const express = require('express');
const cors = require('cors');

const taskRouter = require('./api/tasks');

const indexRouter = require('./pages/index');

const apiRouter = express.Router();
apiRouter.use("/tasks", taskRouter);
apiRouter.use(cors());

const pagesRouter = express.Router();
pagesRouter.use("/", indexRouter);

module.exports = { apiRouter, pagesRouter: pagesRouter };