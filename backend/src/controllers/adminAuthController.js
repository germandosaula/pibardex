const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT token for admin
const generateAdminToken = (adminId) => {
  return jwt.sign({ adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        message: 'Admin account is inactive'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateAdminToken(admin._id);

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      message: 'Admin login successful',
      token,
      admin: adminResponse
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    res.json({
      admin
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      message: 'Error fetching admin profile',
      error: error.message
    });
  }
};

// Create new admin (only superadmin can do this)
const createAdmin = async (req, res) => {
  try {
    // Check if requester is superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        message: 'Only superadmin can create new admins'
      });
    }

    const { username, email, password, role, permissions } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: 'Admin already exists with this email or username'
      });
    }

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || undefined
    });

    await admin.save();

    // Remove password from response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminResponse
    });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      message: 'Error creating admin',
      error: error.message
    });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { username, email, role, permissions, isActive } = req.body;
    const adminId = req.params.id;

    // Only superadmin can update other admins
    if (req.admin.role !== 'superadmin' && req.adminId !== adminId) {
      return res.status(403).json({
        message: 'You can only update your own profile'
      });
    }

    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    // Update fields if provided
    if (username) admin.username = username;
    if (email) admin.email = email;
    
    // Only superadmin can change role and permissions
    if (req.admin.role === 'superadmin') {
      if (role) admin.role = role;
      if (permissions) admin.permissions = { ...admin.permissions, ...permissions };
      if (isActive !== undefined) admin.isActive = isActive;
    }

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      message: 'Admin updated successfully',
      admin: adminResponse
    });

  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      message: 'Error updating admin',
      error: error.message
    });
  }
};

// Change admin password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.adminId).select('+password');
    
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isPasswordValid = await admin.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: 'Error changing password',
      error: error.message
    });
  }
};

// List all admins (only for superadmin)
const listAdmins = async (req, res) => {
  try {
    // Only superadmin can list all admins
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        message: 'Only superadmin can list all admins'
      });
    }

    const admins = await Admin.find().select('-password');

    res.json({
      admins
    });

  } catch (error) {
    console.error('List admins error:', error);
    res.status(500).json({
      message: 'Error listing admins',
      error: error.message
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  createAdmin,
  updateAdmin,
  changePassword,
  listAdmins
};