import express from 'express';
import Marketing from '../models/Marketing.js';
import { protect, checkPermission } from '../middleware/auth.js';
import Banner from '../models/Banner.js';
import Announcement from '../models/Announcement.js';

const router = express.Router();

// @desc    Get all marketing content
// @route   GET /api/marketing
// @access  Private
router.get('/', protect, checkPermission('marketing'), async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status, search, sort = '-createdAt' } = req.query;

    const query = {};
    
    if (type) {
      query.type = type;
    }
    
    if (status) {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'featured') query.isFeatured = true;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const marketing = await Marketing.find(query)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Marketing.countDocuments(query);

    res.status(200).json({
      success: true,
      count: marketing.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      marketing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public marketing content
// @route   GET /api/marketing/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    // Get active banners and announcements from the database
    const [banners, announcements] = await Promise.all([
      Banner.find({ isActive: true }).sort({ createdAt: -1 }),
      Announcement.find({ isActive: true }).sort({ createdAt: -1 })
    ]);

    // Filter by date if startDate and endDate are set
    const now = new Date();
    const activeBanners = banners.filter(banner => {
      if (banner.startDate && banner.startDate > now) return false;
      if (banner.endDate && banner.endDate < now) return false;
      return true;
    });

    const activeAnnouncements = announcements.filter(announcement => {
      if (announcement.startDate && announcement.startDate > now) return false;
      if (announcement.endDate && announcement.endDate < now) return false;
      return true;
    });

    res.status(200).json({
      success: true,
      banners: activeBanners,
      announcements: activeAnnouncements
    });
  } catch (error) {
    console.error('Error fetching public marketing content:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      banners: [],
      announcements: []
    });
  }
});

// @desc    Get single marketing content
// @route   GET /api/marketing/:id
// @access  Private
router.get('/:id', protect, checkPermission('marketing'), async (req, res) => {
  try {
    const marketing = await Marketing.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    if (!marketing) {
      return res.status(404).json({
        success: false,
        message: 'Marketing content not found'
      });
    }

    res.status(200).json({
      success: true,
      marketing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create marketing content
// @route   POST /api/marketing
// @access  Private
router.post('/', protect, checkPermission('marketing'), async (req, res) => {
  try {
    const marketingData = req.body;
    marketingData.createdBy = req.user.id;

    const marketing = await Marketing.create(marketingData);

    res.status(201).json({
      success: true,
      marketing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update marketing content
// @route   PUT /api/marketing/:id
// @access  Private
router.put('/:id', protect, checkPermission('marketing'), async (req, res) => {
  try {
    let marketing = await Marketing.findById(req.params.id);

    if (!marketing) {
      return res.status(404).json({
        success: false,
        message: 'Marketing content not found'
      });
    }

    const marketingData = req.body;
    marketingData.lastUpdatedBy = req.user.id;

    marketing = await Marketing.findByIdAndUpdate(req.params.id, marketingData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email')
      .populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      marketing
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete marketing content
// @route   DELETE /api/marketing/:id
// @access  Private
router.delete('/:id', protect, checkPermission('marketing'), async (req, res) => {
  try {
    const marketing = await Marketing.findById(req.params.id);

    if (!marketing) {
      return res.status(404).json({
        success: false,
        message: 'Marketing content not found'
      });
    }

    await marketing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Marketing content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 