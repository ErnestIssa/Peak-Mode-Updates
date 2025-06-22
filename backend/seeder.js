import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import FAQ from './models/FAQ.js';
import Settings from './models/Settings.js';

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Create default admin user
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (adminExists) {
      console.log('Admin user already exists');
      return adminExists;
    }

    const adminUser = await User.create({
      name: 'Admin User',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      permissions: ['products', 'orders', 'customers', 'reviews', 'marketing', 'messages', 'settings', 'faqs'],
      isActive: true
    });

    console.log('Admin user created successfully');
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  }
};

// Create sample products
const createSampleProducts = async (adminUser) => {
  try {
    const productsCount = await Product.countDocuments();
    
    if (productsCount > 0) {
      console.log('Sample products already exist');
      return;
    }

    const sampleProducts = [
      {
        name: 'Premium Cotton T-Shirt',
        description: 'High-quality cotton t-shirt with a comfortable fit. Perfect for everyday wear.',
        price: 29.99,
        comparePrice: 39.99,
        category: 'mens',
        subcategory: 't-shirts',
        brand: 'Peak Mode',
        sku: 'PM-TS-001',
        inventory: {
          quantity: 100,
          lowStockThreshold: 10,
          trackInventory: true
        },
        attributes: {
          size: ['S', 'M', 'L', 'XL'],
          color: ['Black', 'White', 'Navy', 'Gray'],
          material: '100% Cotton'
        },
        tags: ['cotton', 'comfortable', 'casual'],
        isActive: true,
        isFeatured: true,
        createdBy: adminUser._id
      },
      {
        name: 'Elegant Summer Dress',
        description: 'Beautiful summer dress perfect for any occasion. Made with breathable fabric.',
        price: 79.99,
        comparePrice: 99.99,
        category: 'womens',
        subcategory: 'dresses',
        brand: 'Peak Mode',
        sku: 'PM-DR-001',
        inventory: {
          quantity: 50,
          lowStockThreshold: 5,
          trackInventory: true
        },
        attributes: {
          size: ['XS', 'S', 'M', 'L', 'XL'],
          color: ['Blue', 'Pink', 'White'],
          material: 'Polyester Blend'
        },
        tags: ['summer', 'elegant', 'occasion'],
        isActive: true,
        isFeatured: true,
        createdBy: adminUser._id
      },
      {
        name: 'Leather Crossbody Bag',
        description: 'Stylish leather crossbody bag with adjustable strap. Perfect for daily use.',
        price: 89.99,
        comparePrice: 119.99,
        category: 'accessories',
        subcategory: 'bags',
        brand: 'Peak Mode',
        sku: 'PM-BG-001',
        inventory: {
          quantity: 75,
          lowStockThreshold: 8,
          trackInventory: true
        },
        attributes: {
          color: ['Brown', 'Black', 'Tan'],
          material: 'Genuine Leather'
        },
        tags: ['leather', 'crossbody', 'stylish'],
        isActive: true,
        isOnSale: true,
        salePrice: 69.99,
        createdBy: adminUser._id
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products created successfully');
  } catch (error) {
    console.error('Error creating sample products:', error.message);
  }
};

// Create sample FAQs
const createSampleFAQs = async (adminUser) => {
  try {
    const faqsCount = await FAQ.countDocuments();
    
    if (faqsCount > 0) {
      console.log('Sample FAQs already exist');
      return;
    }

    const sampleFAQs = [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all unused items in their original packaging. Returns are free for orders over $50.',
        category: 'returns',
        order: 1,
        isActive: true,
        isFeatured: true,
        createdBy: adminUser._id
      },
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee.',
        category: 'shipping',
        order: 2,
        isActive: true,
        isFeatured: true,
        createdBy: adminUser._id
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location.',
        category: 'shipping',
        order: 3,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.',
        category: 'general',
        order: 4,
        isActive: true,
        createdBy: adminUser._id
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order ships, you will receive a tracking number via email. You can also track your order in your account dashboard.',
        category: 'orders',
        order: 5,
        isActive: true,
        createdBy: adminUser._id
      }
    ];

    await FAQ.insertMany(sampleFAQs);
    console.log('Sample FAQs created successfully');
  } catch (error) {
    console.error('Error creating sample FAQs:', error.message);
  }
};

// Initialize settings
const initializeSettings = async () => {
  try {
    const settings = await Settings.getInstance();
    console.log('Settings initialized successfully');
    return settings;
  } catch (error) {
    console.error('Error initializing settings:', error.message);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const adminUser = await createAdminUser();
    await createSampleProducts(adminUser);
    await createSampleFAQs(adminUser);
    await initializeSettings();
    
    console.log('Database seeding completed successfully!');
    console.log('\n=== ADMIN LOGIN CREDENTIALS ===');
    console.log(`Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
    console.log('===============================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

// Run seeder
seedDatabase(); 