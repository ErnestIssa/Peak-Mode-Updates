import express from 'express';
import Review from '../models/Review.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private
router.get('/', protect, checkPermission('reviews'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, rating, search, sort = '-createdAt' } = req.query;

    const query = {};
    
    if (status) {
      if (status === 'approved') query.isApproved = true;
      if (status === 'pending') query.isApproved = false;
      if (status === 'featured') query.isFeatured = true;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    if (search) {
      query.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } }
      ];
    }

    const reviews = await Review.find(query)
      .populate('product', 'name images')
      .populate('moderatedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public reviews
// @route   GET /api/reviews/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { productId, page = 1, limit = 10, rating, sort = '-createdAt' } = req.query;

    const query = { isApproved: true };
    
    if (productId) {
      query.product = productId;
    }
    
    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('product', 'name images')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Private
router.get('/:id', protect, checkPermission('reviews'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('product', 'name images')
      .populate('moderatedBy', 'name email');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create review (public)
// @route   POST /api/reviews
// @access  Public
router.post('/', async (req, res) => {
  try {
    const reviewData = req.body;
    reviewData.ipAddress = req.ip;
    reviewData.userAgent = req.get('User-Agent');

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, checkPermission('reviews'), async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const reviewData = req.body;
    reviewData.lastUpdatedBy = req.user.id;

    review = await Review.findByIdAndUpdate(req.params.id, reviewData, {
      new: true,
      runValidators: true
    }).populate('product', 'name images');

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, checkPermission('reviews'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Approve/Reject review
// @route   PATCH /api/reviews/:id/moderate
// @access  Private
router.patch('/:id/moderate', protect, checkPermission('reviews'), async (req, res) => {
  try {
    const { isApproved, moderationNotes } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isApproved = isApproved;
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();
    if (moderationNotes) {
      review.moderationNotes = moderationNotes;
    }

    await review.save();

    res.status(200).json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 