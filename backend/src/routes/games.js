const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Validation middleware
const validateStartGame = [
  body('gameType')
    .isIn(['memory', 'spin_wheel', 'pack_opening'])
    .withMessage('Invalid game type'),
  body('gameData')
    .optional()
    .isObject()
    .withMessage('Game data must be an object')
];

const validateCompleteGame = [
  param('sessionId')
    .isMongoId()
    .withMessage('Invalid session ID'),
  body('won')
    .optional()
    .isBoolean()
    .withMessage('Won must be a boolean'),
  body('score')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Score must be a non-negative integer'),
  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  body('gameData')
    .optional()
    .isObject()
    .withMessage('Game data must be an object')
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

// Game session management
router.post('/start', validateStartGame, handleValidationErrors, gameController.startGameSession);
router.post('/complete/:sessionId', validateCompleteGame, handleValidationErrors, gameController.completeGameSession);

// Game history and statistics
router.get('/history', gameController.getGameHistory);
router.get('/stats', gameController.getGameStats);

module.exports = router;