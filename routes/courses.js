const express = require('express');

const router = express.Router({
    // Enabling other resources to be routed here inside
    mergeParams: true
});

const {
    getAllCourses,
    getSingleCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses.js');


router.route('/')
    .get(getAllCourses)
    .post(addCourse)

router.route('/:id')
    .get(getSingleCourse)
    .put(updateCourse)
    .delete(deleteCourse)

module.exports = router;