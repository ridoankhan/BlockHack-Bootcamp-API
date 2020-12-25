const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @Desc    Register a user
// @Route   POST /api/v1/auth/register
// @Access  Public

const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const user = await User.create({
        name, email, password, role
    });

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});

// @Desc    Login user
// @Route   POST    /api/v1/auth/login
// @Access  Public

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email && !password) {
        return next(new ErrorResponse(`Please provide an email and password`));
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    // Check if password matches
    const passwordIsMatch = await user.matchPassword(password);

    if (!passwordIsMatch) {
        return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    // Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
});

module.exports = { registerUser, loginUser };
