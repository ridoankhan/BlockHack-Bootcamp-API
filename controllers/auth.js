const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc    Register a user
// @Route   POST /api/v1/auth/register
// @Access  Public

const registerUser = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res)
});

// @Desc    Login user
// @Route   POST  /api/v1/auth/login
// @Access  Public

const loginUser = asyncHandler(async (req, res, next) => {
    const {
        email,
        password
    } = req.body

    // Validate email and password
    if (!email && !password) {
        return next(new ErrorResponse(`Please provide an email and password`, 404))
    }

    // Check if user exists
    const user = await User.findOne({
        email: email
    }).select('+password')

    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    // Check if password matches
    const passwordIsMatch = await user.matchPassword(password)

    if (!passwordIsMatch) {
        return next(new ErrorResponse(`Invalid credentials`, 401))
    }

    sendTokenResponse(user, 200, res)
});


// @Desc    To get the cuurent user info (user profile)
// @Route   GET /api/v1/auth/me
// @Access  Private

const currentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
}

module.exports = {
    registerUser,
    loginUser,
    currentUser
};