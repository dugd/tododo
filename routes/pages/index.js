const express = require("express");
const Task = require('../../models/task')

const router = express.Router();


router.get('/', async (req, res) => {
    const tasks = await Task.find();
    res.render('index', {tasks});
});

router.post("/add", async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({error: 'title is required'});

    const task = new Task({ title });
    await task.save();

    res.redirect('/');
})

router.post("/toggle/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });

    task.done = !task.done;
    await task.save();

    res.redirect('/');
})

router.post("/delete/:id", async (req, res) => {
    const result = await Task.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Not found' });

    res.redirect('/')
})


module.exports = router;