// @desc    to get the list of all bootcamps
// @route   GET /api/v1/bootcamp
// @access  public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all bootcamps'
    });
}

// @desc    to get one single bootcamp
// @route   GET /api/v1/bootcamp/:id
// @access  public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        mmsg: `Get bootcamp ${req.params.id}`
    });
}

// @desc    to create a new bootcamp
// @route   POST /api/v1/bootcamp
// @access  private
exports.createBootcamp = (req, res, next) => {
    res.status(201).json({
        success: true,
        mmsg: 'New bootcamp created'
    });
}

// @desc    to update a bootcamp record
// @route   PUT /api/v1/bootcamp/:id
// @access  private
exports.updateBootcamp = (req, res, next) => {
    res.status(201).json({
        success: true,
        mmsg: `Updated Bootcamp ${req.params.id}`
    });
}

// @desc    to delete a bootcamp
// @route   DELETE /api/v1/bootcamp/:id
// @access  private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        mmsg: `delete Bootcamp ${req.params.id}`
    });
}