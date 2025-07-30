const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pibardex');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Create default admin
const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@pibardex.com' });
    
    if (adminExists) {
      console.log('Default admin already exists');
      return;
    }

    // Create new admin
    const admin = new Admin({
      username: 'admin',
      email: 'admin@pibardex.com',
      password: 'admin123', // This will be hashed by the pre-save hook
      role: 'superadmin',
      permissions: {
        manageUsers: true,
        manageCards: true,
        manageGames: true,
        viewStats: true
      }
    });

    await admin.save();

    console.log('Default admin created successfully');
    console.log('Email: admin@pibardex.com');
    console.log('Password: admin123');
    console.log('IMPORTANT: Change this password immediately after first login!');

  } catch (error) {
    console.error('Error creating default admin:', error.message);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run script
connectDB().then(() => {
  createDefaultAdmin();
});