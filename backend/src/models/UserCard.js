const mongoose = require('mongoose');

const userCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  cardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: [true, 'Card ID is required']
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1']
  },
  obtainedAt: {
    type: Date,
    default: Date.now
  },
  obtainedFrom: {
    type: String,
    enum: ['pack', 'reward', 'trade', 'achievement', 'spin_wheel'],
    required: [true, 'Obtained from source is required']
  },
  isNew: {
    type: Boolean,
    default: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  // Campos de mejora por usuario
  isUpgraded: {
    type: Boolean,
    default: false
  },
  upgradeLevel: {
    type: Number,
    default: 0,
    min: 0
  },
  upgradedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate cards for same user
userCardSchema.index({ userId: 1, cardId: 1 }, { unique: true });

// Index for efficient queries
userCardSchema.index({ userId: 1, obtainedAt: -1 });
userCardSchema.index({ userId: 1, isFavorite: 1 });
userCardSchema.index({ userId: 1, isUpgraded: 1 });

module.exports = mongoose.model('UserCard', userCardSchema);