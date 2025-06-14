const express = require('express');
const passport = require('passport');

const router = express.Router();

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
