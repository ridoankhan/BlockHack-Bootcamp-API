const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @Desc    Get all users
// @Route   GET /api/v1/auth/users
// @Access  Private/Admin
exports.getAllUsers = asyncHandler( async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @Desc    Get Single User
// @Route   GET /api/v1/auth/users/:id
// @Access  Private/Admin
exports.getSingleUser = asyncHandler( async(req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorResponse(`No user exists with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

// @Desc    Create New User
// @Route   POST /api/v1/auth/users
// Access   Private/Admin
exports.createUser = asyncHandler( async(req, res, next) =>{
    const user = User.create(req.body);

    res.status(201).json({
        success: true,
        data: user
    });
});

// @Desc    Update User
// @Route   PUT /api/v1/auth/users/:id
// Access   Private/Admin
exports.updateUser = asyncHandler( async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!user){
        return next(new ErrorResponse(`No user found with id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
});

// @Desc    Delete user
// @Route   DELETE /api/v1/auth/users/:id
// Access   Private/Admin
exports.deleteUser = asyncHandler( async (req, res, next) =>{
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});