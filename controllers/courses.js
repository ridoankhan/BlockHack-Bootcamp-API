const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const asyncHandler = require('../middleware/async');

// @Desc    to get courses
// @Route   GET /api/v1/courses
// @Route   GET /api/v1/bootcamps/:bootcampId/courses
// @Access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        query = Course.find();
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})