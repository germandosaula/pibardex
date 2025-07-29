const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validatePackOpening = [
  body('packType')
    .optional()
    .isIn(['starter', 'booster', 'premium', 'special'])
    .withMessage('Invalid pack type')
];

const validateMarkAsSeen = [
  body('cardIds')
    .isArray({ min: 1 })
    .withMessage('Card IDs must be a non-empty array'),
  body('cardIds.*')
    .isMongoId()
    .withMessage('Each card ID must be a valid MongoDB ObjectId')
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

// Public routes (catalog)
router.get('/catalog', cardController.getAllCards);

// Protected routes (require authentication)
router.use(authMiddleware);

// User's card collection
router.get('/collection', cardController.getUserCards);

// Pack operations
router.post('/open-pack', validatePackOpening, handleValidationErrors, cardController.openPack);

// Card management
router.put('/:cardId/favorite', cardController.toggleFavorite);
router.post('/mark-seen', validateMarkAsSeen, handleValidationErrors, cardController.markCardsAsSeen);

module.exports = router;