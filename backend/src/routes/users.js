const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware for coin operations
const validateCoinOperation = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reason cannot exceed 100 characters')
];

// Validation middleware for experience operations
const validateExperienceOperation = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer')
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// All routes require authentication
router.use(authMiddleware);

// Get user stats and profile
router.get('/stats', userController.getUserStats);

// Get leaderboard
router.get('/leaderboard', userController.getLeaderboard);

// Coin operations
router.post('/coins/add', validateCoinOperation, handleValidationErrors, userController.addCoins);
router.post('/coins/spend', validateCoinOperation, handleValidationErrors, userController.spendCoins);

// Experience operations
router.post('/experience/add', validateExperienceOperation, handleValidationErrors, userController.addExperience);

module.exports = router;