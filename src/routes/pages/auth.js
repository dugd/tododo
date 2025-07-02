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
const {
    loginUser,
    registerUser,
    sendEmail,
    sendNewPassword,
} = require('../../validation/auth');
const { validateView } = require('../../middlewares/validate');

const router = express.Router();

router
    .route('/register')
    .get((req, res) => {
        res.render('auth/register');
    })
    .post(registerUser, validateView('/auth/register'), async (req, res) => {
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

router.get('/activate', async (req, res) => {
    const { token } = req.query;

    if (!token) {
        req.flash('error', 'Token is missing');
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

router
    .route('/reset-password/request')
    .get((req, res) => {
        res.render('auth/reset-request');
    })
    .post(
        sendEmail,
        validateView('/auth/reset-password/request'),
        async (req, res) => {
            const { email } = req.body;

            try {
                const token = await resetPasswordRequest(email);
                console.log(`Password reset token: ${token}`);

                req.flash('success', 'Check your email to reset your password');
                res.redirect('/auth/login');
            } catch (err) {
                if (err instanceof AppError) {
                    req.flash('error', err.message);
                    return res.redirect('/auth/reset-password/request');
                }
                throw err;
            }
        }
    );

router
    .route('/reset-password/confirm')
    .get((req, res) => {
        const { token } = req.query;

        if (!token) {
            req.flash('error', 'Token is missing');
            return res.redirect('/auth/reset-password/request');
        }

        res.render('auth/reset-confirm', { token });
    })
    .post(
        sendNewPassword,
        validateView('/auth/reset-password/request'),
        async (req, res) => {
            const { token, newPassword } = req.body;

            if (!token) {
                req.flash('error', 'Token is missing');
                return res.redirect('/auth/reset-password/request');
            }

            try {
                const { userId, type } = jwtVerify(token);

                if (type !== 'password') {
                    req.flash('error', 'Invalid token type');
                    return res.redirect('/auth/reset-password/request');
                }

                await resetPassword(userId, newPassword);

                req.flash('success', 'Password updated');
                res.redirect('/auth/login');
            } catch (err) {
                if (err instanceof AppError) {
                    req.flash('error', err.message);
                    return res.redirect(
                        `/auth/reset-password/confirm?token=${token}`
                    );
                }
                throw err;
            }
        }
    );

router
    .route('/login')
    .get((req, res) => {
        res.render('auth/login');
    })
    .post(
        loginUser,
        validateView('/auth/login'),
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true,
        })
    );

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
