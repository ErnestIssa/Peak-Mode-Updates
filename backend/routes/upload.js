import express from 'express';
import { uploadMultiple, uploadSingle } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Private
router.post('/single', protect, uploadSingle, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const fileUrl = baseUrl + req.file.filename;

    res.status(200).json({
      success: true,
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed'
    });
  }
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, uploadMultiple, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const files = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      url: baseUrl + file.filename,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.status(200).json({
      success: true,
      files
    });
  } catch (error) {
    console.error('Files upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Files upload failed'
    });
  }
});

export default router; 