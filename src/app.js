const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

require('./auth/strategy'); // load passport strategy
const dbConnect = require('./db');

const { apiRouter, pagesRouter } = require('./routes/index');

const port = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', apiRouter);
app.use('/', pagesRouter);

// async start of application
const init = async () => {
    await dbConnect();
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
};

_ = init();
