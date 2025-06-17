const mongoose = require('mongoose');
const regex = require('../utils/regex');

const EXPIRE_IN_OFFSET = 30 * 60 * 1000;

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
            required: true,
            default: false,
        },
        expireAt: {
            type: Date,
            default: new Date(Date.now() + EXPIRE_IN_OFFSET),
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

userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', function (next) {
    if (!this.isActivated && !this.expireAt) {
        this.expireAt = Date.now() + EXPIRE_IN_OFFSET;
    }
    if (this.isActivated) {
        this.expireAt = undefined;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
