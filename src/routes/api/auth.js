const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const regex = require('../../utils/regex');
const { hash, jwtSign, jwtVerify } = require('../../utils/security');
const { isAuthenticated } = require('../../auth/middleware');
const { sendTestEmail } = require('../../services/mail');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: 'Name, email and password are required' });
    }

    if (!regex.email.test(email)) {
        return res.status(400).json({ message: 'Email is invalid' });
    }

    if (!regex.password.test(password)) {
        return res.status(400).json({ message: 'Password is invalid' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email is taken' });
        }

        const passwordHash = await hash(password);
        const newUser = new User({
            name,
            email,
            passwordHash,
            isActivated: false,
        });
        await newUser.save();
        const token = jwtSign({ userId: newUser._id });
        setImmediate(() => {
            sendTestEmail(email).catch(console.error);
        });

        res.status(201).json({
            message: 'Activate your account to complete registration',
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        });
    }
});

router.post('/activate', async (req, res) => {
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
        return res.status(500).json({ message: 'Token verification failed' });
    }

    const userId = payload.userId;
    if (!userId) {
        return res
            .status(400)
            .json({ message: 'Token payload is missing userId' });
    }
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user does not exist' });
        }
        if (user.isActivated) {
            return res
                .status(400)
                .json({ message: 'user is already activated' });
        }
        user.isActivated = true;
        user.expireAt = undefined;
        await user.save();
        res.json({
            message: 'User has been activated',
            user,
        });
    } catch (e) {
        console.error('Error upon user activation:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({
        message: 'Login success',
        user: req.user,
    });
});

router.get('/me', isAuthenticated, (req, res) => {
    return res.json({
        message: 'User is authenticated',
        user: req.user,
    });
});

router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout success' });
    });
});

module.exports = router;
