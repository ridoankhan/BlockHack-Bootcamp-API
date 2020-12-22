const ErrorResponse = require('../utils/errorResponse.js');
const Course = require('../models/Course.js');
const Bootcamp = require('../models/Bootcamp.js')
const asyncHandler = require('../middleware/async.js');

// @Desc    to get courses
// @Route   GET /api/v1/courses
// @Route   GET /api/v1/bootcamps/:bootcampId/courses
// @Access  Public
const getAllCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({
            bootcamp: req.params.bootcampId
        }).populate({
            path: 'bootcamp',
            select: 'name description'
        });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    })
})

// @Desc    Get a single course by id
// @Route   /api/v1/courses/:id
// @Access  Public
const getSingleCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @Desc    Add a new course
// @Route   /api/v1/courses
// @Access  Private

const addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`, 404));
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

// @Desc    Update course
// @Route   /api/v1/courses/:id
// @Access  Private

const updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    })
});

// @Desc    Delete a course by id
// @Route   /api/v1/courses/:id
// @Access  Private

const deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`, 404));
    }

    await course.remove();
    res.status(200).json({
        success: true,
        data: {}
    })
});

module.exports = {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
};