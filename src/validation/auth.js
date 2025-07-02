const { body } = require('express-validator');
const regex = require('../utils/regex');

const registerUser = [
    body('name')
        .notEmpty()
        .withMessage('name is required')
        .isString()
        .isLength({ min: 3, max: 50 })
        .withMessage('name must be beetwen 3 and 50 characters'),

    body('email')
        .notEmpty()
        .withMessage('email is required')
        .matches(regex.email)
        .withMessage('invalid email format'),

    body('password')
        .notEmpty()
        .withMessage('password is required')
        .matches(regex.password)
        .withMessage(
            'password must have 8-20 characters and contain at least one digit and letter'
        ),
];

const loginUser = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .matches(regex.email)
        .withMessage('invalid email format'),

    body('password').notEmpty().withMessage('password is required'),
];

const sendEmail = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .matches(regex.email)
        .withMessage('invalid email format'),
];

const sendNewPassword = [
    body('newPassword')
        .notEmpty()
        .withMessage('password is required')
        .matches(regex.password)
        .withMessage(
            'password must have 8-20 characters and contain at least one digit and letter'
        ),
];

module.exports = {
    registerUser,
    loginUser,
    sendEmail,
    sendNewPassword,
};
