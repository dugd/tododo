const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const regex = require('../../utils/regex');
const { hash, jwtSign, jwtVerify } = require('../../utils/security');
const { isAuthenticated } = require('../../auth/middleware');
const {
    sendMail,
    generateActivateMail,
    generateResetPasswordMail,
} = require('../../services/mail');

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
        const token = jwtSign({ userId: newUser._id, type: 'activate' });
        setImmediate(() => {
            sendMail(email, generateActivateMail(token)).catch(console.error);
        });

        res.status(201).json({
            message:
                'Check your email and activate your account to complete registration',
            token,
        });
    } catch (err) {
        console.error('Error upon user registration:', err.message);
        throw err;
    }
});

router.post('/activate', jwtTokenParser, async (req, res) => {
    const { userId, type: tokenType } = req.tokenPayload;
    if (tokenType !== 'activate' || !userId) {
        return res.status(400).json({ message: 'Invalid token payload' });
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
    } catch (err) {
        console.error('Error upon user activation:', err.message);
        throw err;
    }
});

router.post('/reset-password/request', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'user does not exist' });
        }
        if (!user.isActivated) {
            return res.status(400).json({ message: 'user is not activated' });
        }
        const token = jwtSign({ userId: user._id, type: 'password' });
        setImmediate(() => {
            sendMail(email, generateResetPasswordMail(token)).catch(
                console.error
            );
        });

        res.status(201).json({
            message: 'Check your email to reset your password',
            token,
        });
    } catch (err) {
        console.error('Error upon reset password request:', err.message);
        throw err;
    }
});

router.post('/reset-password/confirm', jwtTokenParser, async (req, res) => {
    const { userId, type: tokenType } = req.tokenPayload;
    if (tokenType !== 'password' || !userId) {
        return res.status(400).json({ message: 'Invalid token payload' });
    }

    const { newPassword } = req.body;

    if (!newPassword) {
        res.status(400).json({ message: 'New password is required' });
    }

    if (!regex.password.test(newPassword)) {
        return res.status(400).json({ message: 'Password is invalid' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user does not exist' });
        }
        if (!user.isActivated) {
            return res.status(400).json({ message: 'user is not activated' });
        }

        const newPasswordHash = await hash(newPassword);
        user.passwordHash = newPasswordHash;
        await user.save();

        res.json({
            message: 'Password has been updated',
            user,
        });
    } catch (err) {
        console.error('Error upon reset password confirmation:', err.message);
        throw err;
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            if (err.status == 401)
                return res.status(401).json({ message: err.message });
            return next(err);
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
