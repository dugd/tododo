const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

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
                const user = User.findOne({ email });
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                    });
                }
                const isMatch = (await user.password) === password; // TODO: Replace with proper password hashing check
                if (!isMatch) {
                    return done(null, false, {
                        message: 'Incorrect email or password.',
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
