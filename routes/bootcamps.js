const express = require('express');
const router = express.Router();

const {
    getAllBootcamps,
    getSingleBootcamp,
    getBootcampByName,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteBootcampByName,
    deleteAllBootcamps
} = require('../Controllers/bootcamps');

router.route('/')
    .get(getAllBootcamps)
    .post(createBootcamp)
    .delete(deleteAllBootcamps);

router.route('/:id')
    .get(getSingleBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router.route('/name/:name')
    .get(getBootcampByName)
    .delete(deleteBootcampByName);


module.exports = router;