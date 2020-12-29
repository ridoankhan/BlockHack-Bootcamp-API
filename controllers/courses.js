const ErrorResponse = require('../utils/errorResponse')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const errorResponse = require('../utils/errorResponse')

// @Desc    to get courses
// @Route   GET /api/v1/courses
// @Route   GET /api/v1/bootcamps/:bootcampId/courses
// @Access  Public
const getAllCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({
            bootcamp: req.params.bootcampId
        })

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
})

// @Desc    Get a single course by id
// @Route   /api/v1/courses/:id
// @Access  Public
const getSingleCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    })
})

// @Desc    Add a new course
// @Route   /api/v1/courses
// @Access  Private
const addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    // Make sure bootcamp exists
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with id of ${req.params.bootcampId}`, 404))
    }

    // Make sure if cuurent logged-in user is the course owner
    if (bootcamp.user.toString() !== req.user.id && req.user.id !== 'admin') {
        return next(new errorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp id: ${bootcamp._id}`, 401))
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    })
})

// @Desc    Update course
// @Route   /api/v1/courses/:id
// @Access  Private
const updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponse(`No course found with id of ${req.params.id}`, 404));
    }

    // Make sure the curernt logged-in user is the course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 401))
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

    // Make sure the curernt logged-in user is the course owner
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new errorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`, 401))

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