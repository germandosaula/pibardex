const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: [true, 'Card number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{3}$/.test(v); // Debe ser exactamente 3 dígitos
      },
      message: 'Card number must be exactly 3 digits (e.g., "001", "042")'
    }
  },
  name: {
    type: String,
    required: [true, 'Card name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Card description is required']
  },
  image: {
    type: String,
    required: [true, 'Card image is required']
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    required: [true, 'Card rarity is required']
  },
  category: {
    type: String,
    enum: ['character', 'item', 'spell', 'location'],
    required: [true, 'Card category is required']
  },
  stats: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    mana: { type: Number, default: 0 }
  },
  abilities: [{
    name: String,
    description: String,
    cost: Number
  }],
  packType: {
    type: String,
    enum: ['starter', 'booster', 'premium', 'special'],
    required: [true, 'Pack type is required']
  },
  dropRate: {
    type: Number,
    required: [true, 'Drop rate is required'],
    min: [0, 'Drop rate cannot be negative'],
    max: [100, 'Drop rate cannot exceed 100']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
cardSchema.index({ rarity: 1, category: 1 });
cardSchema.index({ packType: 1, dropRate: 1 });

module.exports = mongoose.model('Card', cardSchema);