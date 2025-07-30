const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

/**
 * Middleware to verify if the user is an admin
 * This middleware should be used after the regular auth middleware
 */
const isAdmin = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin exists
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    if (!admin.isActive) {
      return res.status(401).json({ message: 'Admin account is inactive' });
    }

    // Add admin id and admin object to request
    req.adminId = decoded.adminId;
    req.admin = admin;
    
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Middleware to check if admin has specific permission
 * @param {string} permission - The permission to check
 */
const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized as admin' });
    }

    // Superadmin has all permissions
    if (req.admin.role === 'superadmin') {
      return next();
    }

    // Check if admin has the required permission
    if (req.admin.permissions && req.admin.permissions[permission]) {
      return next();
    }

    return res.status(403).json({ message: 'Permission denied' });
  };
};

module.exports = {
  isAdmin,
  hasPermission
};