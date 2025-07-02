const sortQueries = (req, res, next) => {
    const { sortBy = 'deadline', sortDir = 'asc' } = req.query;

    const sortObj = {};
    const direction = sortDir === 'desc' ? -1 : 1;
    if (['title', 'deadline', 'priority'].find((i) => i === sortBy)) {
        sortObj[sortBy] = direction;
    }

    req.sortObj = sortObj;
    next();
};

const paginationQueries = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    req.pagination = { limit, skip, page };
    next();
};

module.exports = { sortQueries, paginationQueries };
