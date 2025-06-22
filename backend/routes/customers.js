import express from 'express';
import Order from '../models/Order.js';
import { protect, checkPermission } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
router.get('/', protect, checkPermission('customers'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = '-createdAt' } = req.query;

    // Build aggregation pipeline
    const pipeline = [
      {
        $group: {
          _id: '$customer.email',
          customer: { $first: '$customer' },
          orders: { $push: '$$ROOT' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      }
    ];

    // Add search filter
    if (search) {
      pipeline.unshift({
        $match: {
          $or: [
            { 'customer.name': { $regex: search, $options: 'i' } },
            { 'customer.email': { $regex: search, $options: 'i' } },
            { 'customer.phone': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting
    if (sort === 'totalSpent') {
      pipeline.push({ $sort: { totalSpent: -1 } });
    } else if (sort === 'totalOrders') {
      pipeline.push({ $sort: { totalOrders: -1 } });
    } else if (sort === 'lastOrder') {
      pipeline.push({ $sort: { lastOrder: -1 } });
    } else {
      pipeline.push({ $sort: { lastOrder: -1 } });
    }

    // Add pagination
    pipeline.push(
      { $skip: (page - 1) * limit },
      { $limit: limit }
    );

    const customers = await Order.aggregate(pipeline);

    // Get total count
    const countPipeline = [
      {
        $group: {
          _id: '$customer.email'
        }
      },
      {
        $count: 'total'
      }
    ];

    if (search) {
      countPipeline.unshift({
        $match: {
          $or: [
            { 'customer.name': { $regex: search, $options: 'i' } },
            { 'customer.email': { $regex: search, $options: 'i' } },
            { 'customer.phone': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    const totalResult = await Order.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      success: true,
      count: customers.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get customer details
// @route   GET /api/customers/:email
// @access  Private
router.get('/:email', protect, checkPermission('customers'), async (req, res) => {
  try {
    const { email } = req.params;

    const customerData = await Order.aggregate([
      {
        $match: { 'customer.email': email }
      },
      {
        $group: {
          _id: '$customer.email',
          customer: { $first: '$customer' },
          orders: { $push: '$$ROOT' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' },
          averageOrderValue: { $avg: '$total' }
        }
      }
    ]);

    if (customerData.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const customer = customerData[0];

    // Get recent orders
    const recentOrders = await Order.find({ 'customer.email': email })
      .sort('-createdAt')
      .limit(10)
      .populate('items.product', 'name images');

    res.status(200).json({
      success: true,
      customer: {
        ...customer,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get customer statistics
// @route   GET /api/customers/stats/overview
// @access  Private
router.get('/stats/overview', protect, checkPermission('customers'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalCustomers,
      newCustomersToday,
      newCustomersMonth,
      newCustomersYear,
      topCustomers
    ] = await Promise.all([
      Order.aggregate([
        { $group: { _id: '$customer.email' } },
        { $count: 'total' }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: '$customer.email' } },
        { $count: 'total' }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: '$customer.email' } },
        { $count: 'total' }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfYear } } },
        { $group: { _id: '$customer.email' } },
        { $count: 'total' }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: '$customer.email',
            customer: { $first: '$customer' },
            totalSpent: { $sum: '$total' },
            totalOrders: { $sum: 1 }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers: totalCustomers[0]?.total || 0,
        newCustomers: {
          today: newCustomersToday[0]?.total || 0,
          month: newCustomersMonth[0]?.total || 0,
          year: newCustomersYear[0]?.total || 0
        },
        topCustomers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router; 