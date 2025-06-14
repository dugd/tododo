function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

module.exports = { isAuthenticated };
