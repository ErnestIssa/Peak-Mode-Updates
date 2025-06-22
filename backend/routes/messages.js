import express from 'express';
import Message from '../models/Message.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get('/', protect, checkPermission('messages'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, category, search, sort = '-createdAt' } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    const messages = await Message.find(query)
      .populate('assignedTo', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single message
// @route   GET /api/messages/:id
// @access  Private
router.get('/:id', protect, checkPermission('messages'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('replies.sentBy', 'name email');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Mark as read if status is new
    if (message.status === 'new') {
      message.status = 'read';
      message.readAt = new Date();
      await message.save();
    }

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create message (public)
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  try {
    const messageData = req.body;
    messageData.ipAddress = req.ip;
    messageData.userAgent = req.get('User-Agent');

    const message = await Message.create(messageData);

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Reply to message
// @route   POST /api/messages/:id/reply
// @access  Private
router.post('/:id/reply', protect, checkPermission('messages'), async (req, res) => {
  try {
    const { message: replyMessage, attachments } = req.body;

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    const reply = {
      from: 'admin',
      message: replyMessage,
      sentBy: req.user.id,
      sentAt: new Date()
    };

    if (attachments) {
      reply.attachments = attachments;
    }

    message.replies.push(reply);
    message.status = 'replied';
    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update message status
// @route   PATCH /api/messages/:id/status
// @access  Private
router.patch('/:id/status', protect, checkPermission('messages'), async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (status) {
      message.status = status;
      if (status === 'resolved') {
        message.resolvedAt = new Date();
      } else if (status === 'closed') {
        message.closedAt = new Date();
      }
    }

    if (assignedTo) {
      message.assignedTo = assignedTo;
    }

    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, checkPermission('messages'), async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 