import express from 'express';
import Product from '../models/Product.js';
import { protect, checkPermission } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = express.Router();

// @desc    Get all products (admin)
// @route   GET /api/products
// @access  Private
router.get('/', protect, checkPermission('products'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, sort = '-createdAt' } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'featured') query.isFeatured = true;
      if (status === 'onSale') query.isOnSale = true;
    }

    // Execute query
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public products (frontend)
// @route   GET /api/products/public
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const { page = 1, limit = 12, search, category, sort = '-createdAt' } = req.query;

    // Build query for public products
    const query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }

    // Execute query
    const products = await Product.find(query)
      .select('-createdBy -__v')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total count
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
router.get('/:id', protect, checkPermission('products'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get public product (frontend)
// @route   GET /api/products/public/:id
// @access  Public
router.get('/public/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    }).select('-createdBy -__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.viewCount += 1;
    await product.save();

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create product
// @route   POST /api/products
// @access  Private
router.post('/', protect, checkPermission('products'), uploadProductImages, async (req, res) => {
  try {
    const productData = req.body;
    
    // Handle uploaded files
    if (req.files) {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      
      if (req.files.primaryImage) {
        productData.images = [{
          url: baseUrl + req.files.primaryImage[0].filename,
          alt: productData.name || 'Product image',
          isPrimary: true
        }];
      }
      
      if (req.files.galleryImages) {
        const galleryImages = req.files.galleryImages.map(file => ({
          url: baseUrl + file.filename,
          alt: productData.name || 'Product image'
        }));
        
        if (productData.images) {
          productData.images = [...productData.images, ...galleryImages];
        } else {
          productData.images = galleryImages;
        }
      }
      
      if (req.files.video) {
        productData.videos = [{
          url: baseUrl + req.files.video[0].filename,
          type: 'mp4'
        }];
      }
    }

    // Add created by
    productData.createdBy = req.user.id;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
router.put('/:id', protect, checkPermission('products'), uploadProductImages, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const productData = req.body;
    
    // Handle uploaded files
    if (req.files) {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      
      if (req.files.primaryImage) {
        productData.images = [{
          url: baseUrl + req.files.primaryImage[0].filename,
          alt: productData.name || product.name,
          isPrimary: true
        }];
      }
      
      if (req.files.galleryImages) {
        const galleryImages = req.files.galleryImages.map(file => ({
          url: baseUrl + file.filename,
          alt: productData.name || product.name
        }));
        
        if (productData.images) {
          productData.images = [...productData.images, ...galleryImages];
        } else {
          productData.images = [...product.images, ...galleryImages];
        }
      }
      
      if (req.files.video) {
        productData.videos = [{
          url: baseUrl + req.files.video[0].filename,
          type: 'mp4'
        }];
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, productData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
router.delete('/:id', protect, checkPermission('products'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Bulk operations
// @route   POST /api/products/bulk
// @access  Private
router.post('/bulk', protect, checkPermission('products'), async (req, res) => {
  try {
    const { action, productIds } = req.body;

    if (!action || !productIds || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide action and product IDs'
      });
    }

    let result;

    switch (action) {
      case 'activate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: true }
        );
        break;
      case 'deactivate':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isActive: false }
        );
        break;
      case 'feature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isFeatured: true }
        );
        break;
      case 'unfeature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { isFeatured: false }
        );
        break;
      case 'delete':
        result = await Product.deleteMany({ _id: { $in: productIds } });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.status(200).json({
      success: true,
      message: `Bulk operation completed: ${result.modifiedCount || result.deletedCount} products affected`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 