const User = require('../models/user');
const { verify, hash, jwtSign } = require('../utils/security');
const regex = require('../utils/regex');
const {
    generateActivateMail,
    generateResetPasswordMail,
    sendMail,
} = require('./mail');
const { ValidationError, NotFoundError, AppError } = require('../error');
const {
    WrongCredentials,
    NotActivatedError,
    EmailIsTaken,
} = require('../error/auth');

async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new WrongCredentials('Incorrect email or password.');
    }
    if (!user.isActivated) {
        throw new NotActivatedError();
    }

    const isMatch = await verify(password, user.passwordHash);
    if (!isMatch) {
        throw new WrongCredentials('Incorrect email or password.');
    }

    return user;
}

async function register({ name, email, password }) {
    if (!regex.email.test(email)) {
        throw new ValidationError('Email is invalid');
    }

    if (!regex.password.test(password)) {
        throw new ValidationError('Password is invalid');
    }

    const existing = await User.findOne({ email });
    if (existing) {
        throw new EmailIsTaken('Email is taken');
    }

    await newUser.save();
    const token = jwtSign({ userId: newUser._id, type: 'activate' });
    setImmediate(() => {
        sendMail(email, generateActivateMail(token)).catch(console.error);
    });

    return token;
}

async function activate(userId) {
    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User');
    }
    if (user.isActivated) {
        throw new AppError('user is already activated', 400, false);
    }
    user.isActivated = true;
    user.expireAt = undefined;
    await user.save();

    return user;
}

async function resetPasswordRequest(email) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError('User');
    }
    if (!user.isActivated) {
        throw new NotActivatedError();
    }
    const token = jwtSign({ userId: user._id, type: 'password' });
    setImmediate(() => {
        sendMail(email, generateResetPasswordMail(token)).catch(console.error);
    });

    return token;
}

async function resetPassword(userId, newPassword) {
    if (!regex.password.test(newPassword)) {
        throw new ValidationError('Password is invalid');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new NotFoundError('User');
    }
    if (!user.isActivated) {
        throw new NotActivatedError();
    }

    const newPasswordHash = await hash(newPassword);
    user.passwordHash = newPasswordHash;
    await user.save();
}

module.exports = {
    login,
    register,
    activate,
    resetPasswordRequest,
    resetPassword,
};
