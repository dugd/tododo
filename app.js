const express = require('express');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const dbConnect = require('./db')

const { apiRouter, pagesRouter } = require('./routes/index');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '\\views');

function logger(req, res, next) {
    console.log(req.url);
    next();
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.use(logger);

app.use("/api", apiRouter);
app.use("/", pagesRouter);

// async start of application
const init = async () => {
    await dbConnect();
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    })
}

_ = init()