class AppError extends Error {
    statusCode;
    loggable;

    constructor(message, status = 500, loggable = true) {
        super(message);
        this.status = status;
        this.loggable = loggable;
        this.name = this.constructor.name;
    }
}

class ValidationError extends AppError {
    constructor(
        message = 'Validation failed',
        errors = null,
        loggable = false
    ) {
        super(message, 400, loggable);
        this.errors = errors;
    }
}

class NotFoundError extends AppError {
    constructor(object = 'Resource', loggable = false) {
        super(`${object} not found`, 404, loggable);
    }
}

module.exports = { AppError, ValidationError, NotFoundError };
