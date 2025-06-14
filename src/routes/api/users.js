const express = require('express');
const User = require('../../models/user');

const router = express.Router();

router
    .route('/')
    .get(async (req, res) => {
        const users = await User.find();
        res.json(users);
    })
    .post(async (req, res) => {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    });

module.exports = router;
