const ErrorResponse = require('../utils/errorResponse.js');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for development
    console.log(err);

    // Mongoose bad object that is not in the database
    if (error.name == 'CastError') {
        const message = `Resource not found with id of ${error.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (error.code = 11000) {
        const message = 'Duplicate Feild Value Entered';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
}

module.exports = errorHandler;