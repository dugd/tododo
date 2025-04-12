const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Tasks list...');
})

router.route("/:id")
    .get((req, res) => {
        console.log(req.task);
        res.send(`Get Task with ID: '${req.params.id}'...`);
    })
    .put((req, res) => {
        res.send(`Update Task with ID: '${req.params.id}'...`);
    })
    .delete((req, res) => {
        res.send(`Delete Task with ID: '${req.params.id}'...`);
    })

const tasks = [{name: "Atjimanya"}, {name: "pres kachat'"}, {name: "Prysedanya"}]

router.param('id', (req, res, next, id) => {
    req.task = tasks[id];
    console.log('Id:', id);
    next()
})

module.exports = router;