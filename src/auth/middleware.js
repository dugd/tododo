const { UnauthorizedError } = require('../error/auth');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    throw new UnauthorizedError();
}

module.exports = { isAuthenticated };
