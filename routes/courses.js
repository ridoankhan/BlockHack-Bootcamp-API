const express = require('express')
const router = express.Router({
    // Enabling other resources to be routed here inside
    mergeParams: true
})

const {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses')

const Course = require('../models/Course')

const advancedResults = require('../middleware/advancedResults')
const {
    protect,
    authorize
} = require('../middleware/auth')



router.route('/')
    .get(advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }), getAllCourses)
    .post(protect, authorize('publisher', 'admin'), addCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)

module.exports = router;