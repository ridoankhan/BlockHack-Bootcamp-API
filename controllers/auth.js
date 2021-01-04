const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @Desc    Register a user
// @Route   POST /api/v1/auth/register
// @Access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

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

// @Desc    Logout User
// @Route   GET /api/v1/auth/logout
// @Access  Private
const logoutUser = asyncHandler( async(req, res, next) => {
    const options = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    }

    res.cookie('token', 'none', options);

    res.status(200).json({
        success: true,
        data: {}
    })
});

// @Desc    To get the cuurent user info (user profile)
// @Route   GET /api/v1/auth/me
// @Access  Private
const getCurrentUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    });
})

// @Desc    Forgot password
// @Route   POST /api/v1/auth/forgotpassword
// @Access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user) {
        return next(new ErrorResponse(`There is no user with email of ${req.body.email}`, 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you or someone else has requested the reset of a password. Please
                     make a PUT request to \n\n${resetUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message: message
        });

        res.status(200).json({
            success: true,
            data: 'Email Sent'
        })

    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse(`Email could not be sent`, 500))
    }

    res.status(200).json({
        success: true,
        data: user
    })

});


// @Desc    Reset Password
// @Route   PUT /api/v1/auth/resetpassword/:resettoken
// @Access  Public
const resetPassword = asyncHandler( async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    
    if(!user){
        return next(new ErrorResponse('Invalid token', 400))
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res)
});

// @Desc    Update User Details
// @Route   PUT /api/v1/auth/updatedetails
// @Access  Private
const updateDetails = asyncHandler( async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    })
});

// @Desc    Update Password
// @Route   PUT /api/v1/auth/updatepassword
// @Access  Private
const updatePassword = asyncHandler( async(req, res, next) =>  {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrect`, 401))
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    })
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
};