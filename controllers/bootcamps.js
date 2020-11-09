const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @Desc    to get the list of all bootcamps
// @Route   GET /api/v1/bootcamps
// @Access  Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find();
    const ip = req.connection.remoteAddress;
    res.status(200).json({
        success: true,
        count: bootcamp.length,
        ip: req.ip,
        data: bootcamp
    });
});

// @Desc    to get a bootccamp by name
// @Route   GET /api/v1/bootcamps
// @Access  Private
exports.getBootcampByName = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    // Remove all url syntax like %20 and all this
    const url = decodeURI(req.url);
    const nameToSearch = url.split('/')[2];

    let found = false;
    for (let i = 0; i < bootcamps.length; i++) {
        if (nameToSearch == String(bootcamps[i].name)) {
            found = true;
            return res.status(200).json({
                success: true,
                data: bootcamps[i]
            })
        } else {
            found = false;
        }
    }
    if (!found) {
        return next(new ErrorResponse(`No bootcamp found with name ${nameToSearch}`, 404))
    }
});




// @Desc    To get a single bootcamp
// @Route   GET /api/v1/bootcamp/:id
// @Access  Public
exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });
})

// @Desc    To create a new bootcamp
// @Route   POST /api/v1/bootcamp
// @Access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });

})

// @Desc    To update a bootcamp record
// @Route   PUT /api/v1/bootcamp/:id
// @Access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
})

// @Desc    To delete a bootcamp
// @Route   DELETE /api/v1/bootcamp/name/:name
// @Access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
})

// @Desc    Delete a bootccamp by name
// @Route   DELETE /api/v1/bootcamps/name/:name
// @Access  Private
exports.deleteBootcampByName = asyncHandler(async (req, res, next) => {

    const bootcamps = await Bootcamp.find();
    const url = decodeURI(req.url);
    const nameToDelete = url.split('/')[2];
    let bootcamp;
    for (let i = 0; i < bootcamps.length; i++) {
        if (nameToDelete === bootcamps[i].name) {
            let idToDelete = bootcamps[i].id;
            bootcamp = await Bootcamp.findByIdAndDelete(idToDelete);
            res.status(200).json({
                success: true,
                msg: `Bootcamp deleted with name of ${nameToDelete}`
            })
        }
    }
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.name}`, 404));
    }
});


// @Desc    Delete all bootcamps
// @Route   DELETE  /api/v1/bootcamps
// @Access  Private

exports.deleteAllBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();

        if (bootcamp.lenght == 0) {
            return res.status(400).json({
                success: false,
                msg: `No data exist in the collection to delete`
            })
        }
        const deletedBootcamp = await Bootcamp.deleteMany();

        if (deletedBootcamp) {
            res.status(200).json({
                success: true,
                msg: `All data in Bootcamp collection deleted`
            })
        }
    } catch (error) {
        next(new ErrorResponse(`Failed to delete documents in bootcamps`, 404))
    }
}


// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;

    // Find the latitude/longitude from the geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    // Bootcamps within a given lat and lng will be provided based on radius
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    })

    if (!bootcamps) {
        res.status(400).json({
            success: true,
            msg: 'No bootcamp found for the given zipcode within the distance'
        })
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})