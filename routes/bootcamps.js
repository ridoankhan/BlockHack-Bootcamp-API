const express = require('express');
const router = express.Router();

const {
    getAllBootcamps,
    getSingleBootcamp,
    getBootcampByName,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
} = require('../Controllers/bootcamps');

router.route('/')
    .get(getAllBootcamps)
    .post(createBootcamp);

router.route('/:id')
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/name/:name').get(getBootcampByName)


module.exports = router;