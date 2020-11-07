const express = require('express');
const router = express.Router();

const {
    getAllBootcamps,
    getSingleBootcamp,
    getBootcampByName,
    getBootcampsInRadius,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteBootcampByName,
    deleteAllBootcamps
} = require('../controllers/bootcamps');

router.route('/')
    .get(getAllBootcamps)   // Get list of all bootcamps
    .post(createBootcamp)   // Create a new bootcamp   
    .delete(deleteAllBootcamps) // Delete all bootcamps

router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)  // Get bootcamps within given distance of a zipCode

router.route('/:id')
    .get(getSingleBootcamp) // Get a single bootcamp with bootcamp id
    .put(updateBootcamp)    // Update a bootcamp info with id and data
    .delete(deleteBootcamp) // Delete a bootcamp with an id

router.route('/name/:name')
    .get(getBootcampByName) // Delete a bootcamp by bootcamp-name
    .delete(deleteBootcampByName)   // Delete list of all bootcamps


module.exports = router;