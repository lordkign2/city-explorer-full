// routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { loginRequired } = require('../middleware/auth');

// GET /reviews - Get all reviews with filtering
router.get('/', reviewController.getAllReviews);

// GET /reviews/:id - Get a specific review by ID
router.get('/:id', reviewController.getReviewById);

// POST /reviews - Create a new review
router.post('/', loginRequired, reviewController.createReview);

// PUT /reviews/:id - Update a review
router.put('/:id', loginRequired, reviewController.updateReview);

// DELETE /reviews/:id - Delete a review
router.delete('/:id', loginRequired, reviewController.deleteReview);

// POST /reviews/:id/vote - Vote on review helpfulness
router.post('/:id/vote', loginRequired, reviewController.voteHelpful);

// GET /reviews/place/:placeId - Get reviews for a specific place
router.get('/place/:placeId', reviewController.getPlaceReviews);

module.exports = router;