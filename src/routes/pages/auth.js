const express = require('express');
const passport = require('passport');
const { jwtVerify } = require('../../utils/security');
const { AppError } = require('../../error');
const {
    register,
    resetPassword,
    resetPasswordRequest,
    activate,
} = require('../../services/auth');

const router = express.Router();

router
    .route('/login')
    .get((req, res) => {
        res.render('auth/login');
    })
    .post(
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
        })
    );

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register');
    })
    .post(async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const token = await register({ name, email, password });
            console.log(`Activation token: ${token}`);

            req.flash('success', 'Check your email to activate your account');
            res.redirect('/auth/login');
        } catch (err) {
            if (err instanceof AppError) {
                req.flash('error', err.message);
                return res.redirect('/auth/register');
            }
            throw err;
        }
    });

router.get('/activate', async (req, res, next) => {
    const { token } = req.query;

    if (!token) {
        req.flash('error', 'Token is required');
        return res.redirect('/auth/login');
    }

    try {
        const { userId, type } = jwtVerify(token);

        if (type !== 'activate') {
            req.flash('error', 'Invalid activation token');
            return res.redirect('/auth/login');
        }

        await activate(userId);
        req.flash('success', 'Account activated! You can now login.');
        res.redirect('/auth/login');
    } catch (err) {
        throw err;
    }
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
