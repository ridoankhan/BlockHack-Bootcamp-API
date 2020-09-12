const errorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc    to get the list of all bootcamps
// @route   GET /api/v1/bootcamp
// @access  public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (err) {
        res.status(400).json({
            success: false
        })
    }
}


// @desc    to get a single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  public
exports.getBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {

        next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

        // next(err);

        // res.status(400).json({
        //     success: false
        // });
    }

}

// @desc    to create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  private
exports.createBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error
        });
    }

}

// @desc    to update a bootcamp record
// @route   PUT /api/v1/bootcamp/:id
// @access  private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
}

// @desc    to delete a bootcamp
// @route   DELETE /api/v1/bootcamp/:id
// @access  private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
}