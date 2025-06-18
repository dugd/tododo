const { AppError } = require('./index');

class WrongCredentials extends AppError {
    constructor(message = 'Wrong login or password', loggable = false) {
        super(message, 401, loggable);
    }
}

class NotActivatedError extends AppError {
    constructor(message = 'Account not activated', loggable = false) {
        super(message, 403, loggable);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', loggable = false) {
        super(message, 401, loggable);
    }
}

class EmailIsTaken extends AppError {
    constructor(message = 'Email is taken', loggable = true) {
        super(message, 409, loggable);
    }
}

module.exports = {
    WrongCredentials,
    NotActivatedError,
    UnauthorizedError,
    EmailIsTaken,
};
