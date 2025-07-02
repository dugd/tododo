const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { jwtVerify } = require('../../utils/security');
const { isAuthenticated } = require('../../auth/middleware');
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
const { validateAPI } = require('../../middlewares/validate');
const { ValidationError } = require('../../error');

const router = express.Router();

function jwtTokenParser(req, res, next) {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'token is required in query' });
    }

    let payload;

    try {
        payload = jwtVerify(token);
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return res.status(400).json({ message: 'Token has expired' });
        }
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ message: 'Invalid token format' });
        }
        throw new Error('Token verification failed');
    }
    req.tokenPayload = payload;
    next();
}

router.post('/register', registerUser, validateAPI, async (req, res) => {
    const { name, email, password } = req.body;

    const token = await register({ name, email, password });

    res.status(201).json({
        message:
            'Check your email and activate your account to complete registration',
        token,
    });
});

router.post('/activate', jwtTokenParser, async (req, res) => {
    const { userId, type: tokenType } = req.tokenPayload;

    if (tokenType !== 'activate' || !userId) {
        throw new ValidationError('Invalid token payload');
    }

    const user = await activate(req.tokenPayload);
    res.json({
        message: 'User has been activated',
        user,
    });
});

router.post(
    '/reset-password/request',
    sendEmail,
    validateAPI,
    async (req, res) => {
        const { email } = req.body;

        const token = await resetPasswordRequest(email);
        res.status(201).json({
            message: 'Check your email to reset your password',
            token,
        });
    }
);

router.post(
    '/reset-password/confirm',
    jwtTokenParser,
    sendNewPassword,
    validateAPI,
    async (req, res) => {
        const { userId, type: tokenType } = req.tokenPayload;
        if (tokenType !== 'password' || !userId) {
            throw new ValidationError('Invalid token payload');
        }

        const { newPassword } = req.body;

        await resetPassword(req.tokenPayload, newPassword);

        res.json({
            message: 'Password has been updated',
        });
    }
);

router.post('/login', loginUser, validateAPI, (req, res, next) => {
    passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                message: info?.message || 'Authentication failed',
            });
        }

        req.login(user, (err) => {
            if (err) return next(err);
            res.json({
                message: 'Login success',
                user,
            });
        });
    })(req, res, next);
});

router.get('/me', isAuthenticated, (req, res) => {
    return res.json({
        message: 'User is authenticated',
        user: req.user,
    });
});

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ message: 'Logout success' });
    });
});

module.exports = router;
