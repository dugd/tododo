const express = require('express');

const taskRouter = require('./api/tasks');
const userRouter = require('./api/users');

const indexRouter = require('./pages/index');

const apiRouter = express.Router();
apiRouter.use('/tasks', taskRouter);
apiRouter.use('/users', userRouter);

const pagesRouter = express.Router();
pagesRouter.use('/', indexRouter);

apiRouter.get('/test-session', async (req, res) => {
    req.session.visited = true;
    console.log(req.session);
    console.log(req.session.id);
    res.send('ok');
});

module.exports = { apiRouter, pagesRouter: pagesRouter };
