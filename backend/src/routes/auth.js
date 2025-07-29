const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { 
  validateRegister, 
  validateLogin, 
  validateProfileUpdate, 
  handleValidationErrors 
} = require('../middleware/validation');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, authController.register);
router.post('/login', validateLogin, handleValidationErrors, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, validateProfileUpdate, handleValidationErrors, authController.updateProfile);

module.exports = router;