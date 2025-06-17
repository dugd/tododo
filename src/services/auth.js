const User = require('../models/user');

async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Incorrect email or password.');
    }
    if (!user.isActivated) {
        throw new Error('User is not activated.');
    }

    const isMatch = await verify(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Incorrect email or password.');
    }
}

async function register({ name, email, password }) {
    if (!regex.email.test(email)) {
        throw new Error('Email is invalid');
    }

    if (!regex.password.test(password)) {
        throw new Error('Password is invalid');
    }

    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email is taken');
    }

    await newUser.save();
    const token = jwtSign({ userId: newUser._id, type: 'activate' });
    setImmediate(() => {
        sendMail(email, generateActivateMail(token)).catch(console.error);
    });

    return token;
}

async function activate(tokenPayload) {
    const { userId, type: tokenType } = req.tokenPayload;
    if (tokenType !== 'activate' || !userId) {
        throw new Error('Invalid token payload');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('user does not exist');
    }
    if (user.isActivated) {
        throw new Error('user is already activated');
    }
    user.isActivated = true;
    user.expireAt = undefined;
    await user.save();

    return user;
}

async function resetPasswordRequest(email) {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('user does not exist');
    }
    if (!user.isActivated) {
        throw new Error('user is not activated');
    }
    const token = jwtSign({ userId: user._id, type: 'password' });
    setImmediate(() => {
        sendMail(email, generateResetPasswordMail(token)).catch(console.error);
    });

    return token;
}

async function resetPassword(tokenPayload, newPassword) {
    const { userId, type: tokenType } = tokenPayload;
    if (tokenType !== 'password' || !userId) {
        throw new Error('Invalid token payload');
    }

    if (!regex.password.test(newPassword)) {
        throw new Error('Password is invalid');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('user does not exist');
    }
    if (!user.isActivated) {
        throw new Error('user is not activated');
    }

    const newPasswordHash = await hash(newPassword);
    user.passwordHash = newPasswordHash;
    await user.save();
}
