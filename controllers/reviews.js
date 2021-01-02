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
exports.getSingleReview = asyncHandler( async(req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!review){
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
    return next( new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`,404));
  }

    // Check for published bootcamp
    const publishedReview = await Review.findOne({
        bootcamp: req.params.bootcampId
    });

    if (publishedReview && req.user.role !== 'user') {
        return next(new ErrorResponse(`The user with ID of ${req.user.id} already has 1 review for bootcamp ${req.params.bootcampId}`, 404))
    }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});