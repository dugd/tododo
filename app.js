const express = require('express');

const taskRouter = require('./routes/tasks');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log("Here");
    res.render('index', {text: 'Dugd'});
});

app.use("/tasks", taskRouter);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})