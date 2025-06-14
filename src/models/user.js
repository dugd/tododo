const mongoose = require('mongoose');
const regex = require('../utils/regex');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            validate: {
                validator: (v) => {
                    return regex.email.test(v);
                },
                message: (props) => 'email is invalid',
            },
        },
        password: {
            type: String,
            required: true,
            validate: {
                validator: (v) => {
                    return regex.password.test(v);
                },
                message: (props) => 'password is invalid',
            },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
