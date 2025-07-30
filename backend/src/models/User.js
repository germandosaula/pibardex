const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  coins: {
    type: Number,
    default: 100,
    min: [0, 'Coins cannot be negative']
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1']
  },
  experience: {
    type: Number,
    default: 0,
    min: [0, 'Experience cannot be negative']
  },
  avatar: {
    type: String,
    default: null
  },
  stats: {
    totalGamesPlayed: { type: Number, default: 0 },
    memoryGamesWon: { type: Number, default: 0 },
    spinWheelSpins: { type: Number, default: 0 },
    cardsCollected: { type: Number, default: 0 },
    packsOpened: { type: Number, default: 0 }
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  unlockedSkins: [{
    type: String,
    default: []
  }],
  selectedSkin: {
    type: String,
    default: 'default'
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Add coins method
userSchema.methods.addCoins = function(amount) {
  this.coins += amount;
  return this.save();
};

// Spend coins method
userSchema.methods.spendCoins = function(amount) {
  if (this.coins < amount) {
    throw new Error('Insufficient coins');
  }
  this.coins -= amount;
  return this.save();
};

// Add experience method with new leveling system
userSchema.methods.addExperience = function(amount) {
  this.experience += amount;
  
  // Nueva lógica de nivel: 0-100 primer nivel, incremento 10% por nivel
  // Nivel 1: 0-100 XP (100 XP)
  // Nivel 2: 100-210 XP (110 XP)
  // Nivel 3: 210-331 XP (121 XP)
  // etc.
  
  const calculateLevelFromExperience = (exp) => {
    let level = 1;
    let totalExpNeeded = 0;
    let expForCurrentLevel = 100; // Primer nivel requiere 100 XP
    
    while (totalExpNeeded + expForCurrentLevel <= exp) {
      totalExpNeeded += expForCurrentLevel;
      level++;
      expForCurrentLevel = Math.floor(expForCurrentLevel * 1.1); // Incremento del 10%
    }
    
    return level;
  };
  
  const newLevel = calculateLevelFromExperience(this.experience);
  
  if (newLevel > this.level) {
    const levelsGained = newLevel - this.level;
    this.level = newLevel;
    
    // Bonus coins for leveling up (50 coins por nivel)
    this.coins += levelsGained * 50;
  }
  
  return this.save();
};

// Helper method to get experience needed for next level
userSchema.methods.getExpForNextLevel = function() {
  let totalExpNeeded = 0;
  let expForLevel = 100; // Primer nivel requiere 100 XP
  
  for (let level = 1; level < this.level; level++) {
    totalExpNeeded += expForLevel;
    expForLevel = Math.floor(expForLevel * 1.1);
  }
  
  // Experiencia necesaria para el siguiente nivel
  const expForNextLevel = expForLevel;
  const expInCurrentLevel = this.experience - totalExpNeeded;
  
  return {
    current: expInCurrentLevel,
    needed: expForNextLevel,
    percentage: Math.floor((expInCurrentLevel / expForNextLevel) * 100)
  };
};

// Add skin method
userSchema.methods.addSkin = function(skinId) {
  if (!this.unlockedSkins.includes(skinId)) {
    this.unlockedSkins.push(skinId);
  }
  return this.save();
};

// Select skin method
userSchema.methods.selectSkin = function(skinId) {
  if (this.unlockedSkins.includes(skinId) || skinId === 'default') {
    this.selectedSkin = skinId;
    return this.save();
  }
  throw new Error('Skin not unlocked');
};

module.exports = mongoose.model('User', userSchema);