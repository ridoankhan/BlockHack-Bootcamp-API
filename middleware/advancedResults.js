const advancedResults = (model, populate) => async (req, res, next) => {
    // Steps to perform random queries
    // 1. deleting the words like select, sort, page, limit from req.query
    // 2. convert req.query (reqQuery) to string for manipulation
    // 3. replace operators like gt, lt with $gt, $lt to enable query in mongodb
    // 4. Convert req.query (reqQuery) back to JSON object again as mongoDB allows only JSON object not string
    // 5. find resource in model by performing query in model file with the manipulated req.query (reqQuery)
    // 5. Manipulated the result query with the select, sort and pagination options from the req.query.select and req.query.sort

    // Copy req.query
    const reqQuery = {
        ...req.query
    };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removefileds and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators like $gt, $lt and etc
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    let query = model.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort by given fields or by default with createdAt
    if (req.query.sort) {
        const sortByFields = req.query.select.split(',').join(' ');
        query = query.sort(sortByFields);
    } else {
        query = query.sort('-createdAt');
    }

    // Pagination by given no of pages and limit per page
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments()

    query = query.limit(limit).skip(startIndex)

    if (populate) {
        query = query.populate(populate);
    }

    const results = await query;

    // pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        count: results.length,
        pagination: pagination,
        data: results
    }

    next();
}

module.exports = advancedResults;