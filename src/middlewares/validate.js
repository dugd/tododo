const { validationResult } = require('express-validator');
const { ValidationError } = require('../error');

const validateAPI = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(undefined, errors.array());
    }
    next();
};

const validateView =
    (redirectTo = 'back') =>
    (req, res, next) => {
        if (typeof redirectTo == 'function') redirectTo = redirectTo(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const message = errors.array()[0].msg;
            req.flash('error', message);
            return res.redirect(
                redirectTo === 'back' ? req.get('Referrer') || '/' : redirectTo
            );
        }
        next();
    };

module.exports = { validateAPI, validateView };
