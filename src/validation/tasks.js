function validateTask(data, isUpdate = false) {
    const errors = [];
    const { title, done, description, deadline, priority, subtasks } = data;

    if (!isUpdate && typeof title !== 'string') {
        errors.push('title is required and must be a string');
    } else if (title && typeof title !== 'string') {
        errors.push('title must be a string');
    }

    if (done !== undefined && typeof done !== 'boolean') {
        errors.push('done must be a boolean');
    }

    if (description !== undefined && typeof description !== 'string') {
        errors.push('description must be a string');
    }

    if (deadline !== undefined && isNaN(Date.parse(deadline))) {
        errors.push('deadline must be a date format');
    }

    if (priority !== undefined) {
        if (!Number.isInteger(priority) || priority < 1 || priority > 3) {
            errors.push('priority must be an integer between 1 and 3');
        }
    }

    if (subtasks !== undefined) {
        if (!Array.isArray(subtasks)) {
            errors.push('subtasks must be an array');
        } else {
            subtasks.forEach((subtask, ind) => {
                if (typeof subtask !== 'object' || subtask === null) {
                    errors.push(`subtask[${ind}] must be an object`);
                }

                const { title, done } = subtask;

                if (title !== undefined && typeof title !== 'string') {
                    errors.push(
                        `subtask[${ind}].title is required and must be a string`
                    );
                }

                if (done !== undefined && typeof done !== 'boolean') {
                    errors.push(`subtask[${ind}].done must be a boolean`);
                }
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

const createValidation = async (req, res, next) => {
    const data = req.body;
    const { isValid, errors } = validateTask(data, false);
    if (!isValid) {
        return res.status(400).json({
            message: 'validation error',
            errors: errors,
        });
    }
    next();
};

const updateValidation = async (req, res, next) => {
    const data = req.body;
    const { isValid, errors } = validateTask(data, true);
    if (!isValid) {
        return res.status(400).json({
            message: 'validation error',
            errors: errors,
        });
    }
    next();
};

module.exports = {
    createValidation,
    updateValidation,
};
