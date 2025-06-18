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
    constructor(object = 'Validation failed', loggable = false) {
        super(`${object} not found`, 400, loggable);
    }
}

class NotFoundError extends AppError {
    constructor(object = 'Resource', loggable = false) {
        super(`${object} not found`, 404, loggable);
    }
}

module.exports = { AppError, ValidationError, NotFoundError };
