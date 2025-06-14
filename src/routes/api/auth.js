const express = require('express');
const passport = require('passport');
const User = require('../../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: 'Name, email and password are required' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email is taken' });
        }

        const newUser = new User({ name, email, password }); // TODO: Hash before saving
        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({
        message: 'Login success',
        user: req.user,
    });
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated() && req.user) {
        return res.json({
            message: 'User is authenticated',
            user: req.user,
        });
    }
    res.status(401).json({ message: 'User is not authenticated' });
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
