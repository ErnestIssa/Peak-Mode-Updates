import express from 'express';
import FAQ from '../models/FAQ.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Private
router.get('/', protect, checkPermission('faqs'), async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, search, sort = 'order' } = req.query;

    const query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'featured') query.isFeatured = true;
    }
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const faqs = await FAQ.find(query)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await FAQ.countDocuments(query);

    res.status(200).json({
      success: true,
      count: faqs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public FAQs
// @route   GET /api/faqs/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { category, search, sort = 'order' } = req.query;

    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const faqs = await FAQ.find(query)
      .sort(sort)
      .exec();

    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Private
router.get('/:id', protect, checkPermission('faqs'), async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    res.status(200).json({
      success: true,
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create FAQ
// @route   POST /api/faqs
// @access  Private
router.post('/', protect, checkPermission('faqs'), async (req, res) => {
  try {
    const faqData = req.body;
    faqData.createdBy = req.user.id;

    const faq = await FAQ.create(faqData);

    res.status(201).json({
      success: true,
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private
router.put('/:id', protect, checkPermission('faqs'), async (req, res) => {
  try {
    let faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    const faqData = req.body;
    faqData.lastUpdatedBy = req.user.id;

    faq = await FAQ.findByIdAndUpdate(req.params.id, faqData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private
router.delete('/:id', protect, checkPermission('faqs'), async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.deleteOne();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reorder FAQs
// @route   PUT /api/faqs/reorder
// @access  Private
router.put('/reorder', protect, checkPermission('faqs'), async (req, res) => {
  try {
    const { faqs } = req.body; // Array of { id, order }

    if (!Array.isArray(faqs)) {
      return res.status(400).json({
        success: false,
        message: 'FAQs array is required'
      });
    }

    const updatePromises = faqs.map(({ id, order }) =>
      FAQ.findByIdAndUpdate(id, { order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'FAQs reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 