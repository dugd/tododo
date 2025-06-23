const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');
const { login } = require('../services/auth');
const { WrongCredentials, NotActivatedError } = require('../error/auth');

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
                const user = await login(email, password);
                done(null, user, { message: 'Login success' });
            } catch (error) {
                if (
                    error instanceof WrongCredentials ||
                    error instanceof NotActivatedError
                ) {
                    return done(null, false, { message: error.message });
                }
                return done(error, null);
            }
        }
    )
);
