const express = require('express');
const passport = require('passport');

const router = express.Router();

router
    .route('/login')
    .get((req, res) => {
        res.render('auth/login');
    })
    .post(
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true,
        })
    );

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register');
    })
    .post((req, res) => {
        res.status(404);
    });

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
