const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');
const { login } = require('../services/auth');

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
                done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
