const apiErrorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (err.loggable ?? true) {
        console.error(err);
    }

    res.status(status).json({
        message: err.message || 'Internal Server Error',
        errors: err.errors || undefined,
    });
};

const viewErrorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    console.error(err);

    if (err.loggable ?? true) {
        console.error(err);
    }

    if (status === 401) {
        req.flash('error', 'Not authorized');
        return res.redirect('/auth/login');
    }

    res.status(status).render('error', {
        message: err.message || 'Internal server Error',
    });
};

module.exports = { apiErrorHandler, viewErrorHandler };
