const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../Models/Bootcamp');
const asyncHandler = require('../Middleware/async');

// @Desc    to get the list of all bootcamps
// @Route   GET /api/v1/bootcamps
// @Access  Public
exports.getAllBootcamps = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.find();

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp
    });
});

// @Desc    to get a bootccamp by name
// @Route   GET /api/v1/bootcamps
// @Access  Private
exports.getBootcampByName = asyncHandler(async (req, res, next) => {

    const bootcamps = await Bootcamp.find();
    const url = req.url;
    const nameToSearch = url.split('/')[2];
    let found = false;

    for (let i = 0; i < bootcamps.length; i++) {
        if (nameToSearch === bootcamps[i].name) {
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
// @Route   DELETE /api/v1/bootcamp/:id
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

// @Desc    to get a bootccamp by name
// @Route   GET /api/v1/bootcamps
// @Access  Private
exports.deleteBootcampByName = asyncHandler(async (req, res, next) => {

    const bootcamps = await Bootcamp.find();
    const url = req.url;
    const nameToSearch = url.split('/')[2];
    let bootcamp;
    for (let i = 0; i < bootcamps.length; i++) {
        if (nameToSearch === bootcamps[i].name) {
            let idToDelete = bootcamps[i].id;
            bootcamp = await Bootcamp.findByIdAndDelete(idToDelete);
            res.status(200).json({
                success: true,
                msg: `Bootcamp deleted with name of ${nameToSearch}`
            })
        }
    }
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
});