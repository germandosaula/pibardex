const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  gameType: {
    type: String,
    enum: ['memory', 'spin_wheel', 'pack_opening'],
    required: [true, 'Game type is required']
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  result: {
    won: { type: Boolean, default: false },
    coinsEarned: { type: Number, default: 0 },
    experienceEarned: { type: Number, default: 0 },
    cardsObtained: [{
      cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
      quantity: { type: Number, default: 1 }
    }]
  },
  gameData: {
    // Memory game specific data
    difficulty: String,
    moves: Number,
    timeBonus: Number,
    
    // Spin wheel specific data
    spinResult: String,
    wheelPosition: Number,
    
    // Pack opening specific data
    packType: String,
    packsOpened: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
gameSessionSchema.index({ userId: 1, createdAt: -1 });
gameSessionSchema.index({ gameType: 1, status: 1 });

module.exports = mongoose.model('GameSession', gameSessionSchema);