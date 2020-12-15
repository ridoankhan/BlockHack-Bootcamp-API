const express = require('express');

const router = express.Router({
    // Enabling other resources to be routed here inside
    mergeParams: true
});

const {
    getCourses
} = require('../controllers/courses.js');



router.route('/')
    .get(getCourses);

module.exports = router;