const { UnauthorizedError } = require('../error/auth');

function isAuthenticated(req, res, next) {
    console.log('[AUTH MIDDLE]', req.originalUrl);
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    throw new UnauthorizedError();
}

function authLocals(req, res, next) {
    res.locals.isAuthenticated = !!req.user;
    res.locals.currentUser = req.user || null;
    next();
}

module.exports = { isAuthenticated, authLocals };
