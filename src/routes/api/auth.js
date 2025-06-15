const express = require('express');
const passport = require('passport');
const User = require('../../models/user');
const regex = require('../../utils/regex');
const { hash, jwtSign } = require('../../utils/security');
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

        const hashedPassword = await hash(password);
        const newUser = new User({ name, email, passwordHash: hashedPassword });
        await newUser.save();
        const token = jwtSign({ userId: newUser._id });
        setImmediate(() => {
            sendTestEmail(email).catch(console.error);
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message,
        });
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
