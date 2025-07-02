const { body } = require('express-validator');

const baseValidation = [
    body('title')
        .notEmpty()
        .withMessage('title is required')
        .isString()
        .withMessage('title must be a string'),

    body('done').optional().isBoolean().withMessage('done must be a boolean'),

    body('description')
        .optional()
        .isString()
        .withMessage('description must be a string'),

    body('deadline')
        .optional()
        .custom((value) => {
            if (isNaN(Date.parse(value))) {
                throw new Error('deadline must be a date format');
            }
            return true;
        }),

    body('priority')
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage('priority must be an integer between 1 and 3'),

    body('subtasks')
        .optional()
        .isArray()
        .withMessage('subtasks must be an array'),

    body('subtasks.*')
        .optional()
        .isObject()
        .withMessage('each subtask must be an object'),

    body('subtasks.*.title')
        .notEmpty()
        .withMessage('subtask.title is required')
        .isString()
        .withMessage('subtask.title must be a string'),

    body('subtasks.*.done')
        .optional()
        .isBoolean()
        .withMessage('subtask.done must be a boolean'),
];

const createValidation = [...baseValidation];

const updateValidation = [...baseValidation];

module.exports = {
    createValidation,
    updateValidation,
};
