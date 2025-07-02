const { validationResult } = require('express-validator');
const { ValidationError } = require('../error');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError(undefined, errors.array());
    }
    next();
};

module.exports = validate;
