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
        passwordHash: {
            type: String,
            required: true,
        },
        isActivated: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.passwordHash;
            },
        },
    }
);

module.exports = mongoose.model('User', userSchema);
