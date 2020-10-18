const errorResponse = require('../utils/errorResponse');
const Bootcamp = require('../Models/Bootcamp');

// @Desc    to get the list of all bootcamps
// @Route   GET /api/v1/bootcamps
// @Access  Public
exports.getAllBootcamps = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamp.length,
            data: bootcamp
        });
    } catch (err) {
        next(err);
    }

}

// @Desc    to get a bootccamp by name
// @Route   GET /api/v1/bootcamps
// @Access  Private
exports.getBootcampByName = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        const url = req.url;
        const nameToSearch = url.split('/')[2];

        for (let i = 0; i < bootcamps.length; i++) {
            if (nameToSearch === bootcamps[i].name) {
                return res.status(200).json({
                    success: true,
                    data: bootcamps[i]
                })
            }
        }

        res.status(200).json({ msg: 'Got request on /name route', data: bootcamps })
    } catch (err) {
        next(err);
    }
}




// @Desc    To get a single bootcamp
// @Route   GET /api/v1/bootcamp/:id
// @Access  Public
exports.getSingleBootcamp = async (req, res, next) => {

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

        // next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

        next(err);
    }

}

// @Desc    To create a new bootcamp
// @Route   POST /api/v1/bootcamp
// @Access  Private
exports.createBootcamp = async (req, res, next) => {

    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err)
    }

}

// @Desc    To update a bootcamp record
// @Route   PUT /api/v1/bootcamp/:id
// @Access  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        next(new errorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

        res.status(200).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err)
    }
}

// @Desc    To delete a bootcamp
// @Route   DELETE /api/v1/bootcamp/:id
// @Access  Private
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
        next(err);
    }
}