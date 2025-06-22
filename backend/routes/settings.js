import express from 'express';
import Settings from '../models/Settings.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const settings = await Settings.getInstance();

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    // Return mock/default settings for now - you can store these in database later
    const publicSettings = {
      businessInfo: {
        storeName: 'Peak Mode',
        businessAddress: '123 Business Street, Stockholm, Sweden',
        contactEmail: 'contact@peakmode.com',
        phoneNumber: '+46 123 456 789',
        logo: '',
        favicon: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          tiktok: '',
          youtube: '',
          twitter: ''
        }
      },
      websiteConfig: {
        homepageLayout: 'hero',
        heroSection: {
          title: 'Welcome to Peak Mode',
          subtitle: 'Discover Premium Athletic Wear',
          image: ''
        },
        announcementBar: {
          enabled: false,
          message: ''
        },
        maintenanceMode: false,
        seo: {
          title: 'Peak Mode - Premium Athletic Wear',
          description: 'Discover premium athletic wear designed for performance and style.',
          keywords: 'athletic wear, sportswear, fitness, premium clothing'
        }
      }
    };

    res.status(200).json({
      success: true,
      ...publicSettings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
router.put('/', protect, authorize('admin'), async (req, res) => {
  try {
    const settingsData = req.body;
    const settings = await Settings.getInstance();

    // Update settings
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] !== undefined) {
        settings[key] = settingsData[key];
      }
    });

    await settings.save();

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update specific setting section
// @route   PATCH /api/settings/:section
// @access  Private/Admin
router.patch('/:section', protect, authorize('admin'), async (req, res) => {
  try {
    const { section } = req.params;
    const sectionData = req.body;
    const settings = await Settings.getInstance();

    if (!settings[section]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid setting section'
      });
    }

    // Update specific section
    settings[section] = { ...settings[section], ...sectionData };
    await settings.save();

    res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Private/Admin
router.post('/reset', protect, authorize('admin'), async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    // Reset to default values
    settings.business = {
      name: 'Peak Mode',
      email: 'info@peakmode.com',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      logo: { url: '', alt: '' },
      favicon: { url: '' },
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      }
    };

    settings.website = {
      title: 'Peak Mode - Premium Fashion & Lifestyle',
      description: '',
      keywords: [],
      maintenance: {
        isActive: false,
        message: ''
      },
      analytics: {
        googleAnalytics: '',
        facebookPixel: ''
      },
      seo: {
        robotsTxt: '',
        sitemapUrl: '',
        canonicalUrl: ''
      }
    };

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings reset to default',
      settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 