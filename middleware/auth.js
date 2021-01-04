const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')

// Function to check if Bearer Token exists and match token with database token for a user to allow access to resources
const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.token) {
        // Set token from cookie in header
        token = req.cookies.token;
    }

    if (!token) {
        return next(new ErrorResponse(`Not authorized to access this route`, 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        return next(new ErrorResponse(`Not authorized to access this route`, 401))
    }

})

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next()
    }
}

module.exports = {
    protect,
    authorize
};