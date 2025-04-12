const express = require('express');

const taskRouter = require('./routes/tasks');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

function logger(req, res, next) {
    console.log(req.url);
    next();
}

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger);
app.use("/tasks", taskRouter);

app.get('/', (req, res) => {
    res.render('index', {text: 'Dugd'});
});

app.post('/echo', (req, res) => {
    res.send(req.body);
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})