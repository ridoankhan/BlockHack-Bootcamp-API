const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @Desc    To get all reviews and reviews for a specific bootcamp
// @Route   GET /api/v1/reviews
// @Route   GET /api/v1/bootcamps/:bootcampId/reviews
// @Access  Public
exports.getAllReviews = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const reviews = await Review.find({
            bootcamp: req.params.bootcampId
        })

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @Desc    Get Single Review
// @Route   GET /api/v1/reviews
// @Access  Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }

    // Check for published bootcamp
    const publishedReview = await Review.findOne({
        user: req.user.id
    });

    // Preventing user from submitting more than one review per bootcamp
    if (publishedReview && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID of ${req.user.id} already has 1 review for bootcamp ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

// @Desc    Update Review
// @Route   PUT /api/v1/reviews/:id
// @Access  Private
exports.updateReview = asyncHandler( async(req, res, next) => {
    let review = await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    if(review.user.toString() !== req.user.id  && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this review`, 401));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });

});

// @Desc    Delete Review
// @Route   DELETE /api/v1/reviews/:id
// @Access  Private
exports.deleteReview = asyncHandler( async(req, res, next) => {
    const review = await Review.findById(req.params.id);

    if(!review){
        return next(new ErrorResponse(`No review found with id of ${req.params.id}`, 404));
    }

    if(review.user.toString() !== req.user.id  && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this review`, 401));
    }

    await review.remove()

    res.status(200).json({
        success: true,
        data: {}
    });

});