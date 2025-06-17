const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');
const { verify } = require('../utils/security');
const { HttpError } = require('../error');

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
                    throw new HttpError('Incorrect email or password.', 401);
                }
                if (!user.isActivated) {
                    throw new HttpError('User is not activated.', 401);
                }

                const isMatch = await verify(password, user.passwordHash);
                if (!isMatch) {
                    throw new HttpError('Incorrect email or password.', 401);
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
