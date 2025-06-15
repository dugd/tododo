const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');
const { verify } = require('../utils/security');

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            // TODO: log this
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
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
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
