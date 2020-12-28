const express = require('express')
const router = express.Router()
const {
    getAllBootcamps,
    getSingleBootcamp,
    getBootcampByName,
    getBootcampsInRadius,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    deleteBootcampByName,
    deleteAllBootcamps,
    bootcampPhotoUpload
} = require('../controllers/bootcamps')
const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')
// Include resource routers
const courseRouter = require('./courses')
const {
    protect,
    authorize
} = require('../middleware/auth')


// Re-route into other resource router
router.use('/:bootcampId/courses', courseRouter)


router.route('/radius/:zipcode/:distance') // Get bootcamps within given distance of a zipCode
    .get(getBootcampsInRadius)

// upload photo for a bootcamp using bootcamp id 
router.route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload)

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), getAllBootcamps) // Get list of all bootcamps
    .post(protect, authorize('publisher', 'admin'), createBootcamp) // Create a new bootcamp   
    .delete(protect, authorize('publisher', 'admin'), deleteAllBootcamps) // Delete all bootcamps

router.route('/:id')
    .get(getSingleBootcamp) // Get a single bootcamp with bootcamp id
    .put(protect, authorize('publisher', 'admin'), updateBootcamp) // Update a bootcamp info with id and data
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp) // Delete a bootcamp with an id

router.route('/name/:name')
    .get(getBootcampByName) // Delete a bootcamp by bootcamp-name
    .delete(protect, authorize('publisher', 'admin'), deleteBootcampByName) // Delete list of all bootcamps


module.exports = router;