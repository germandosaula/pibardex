const User = require('../models/User');
const UserCard = require('../models/UserCard');
const Card = require('../models/Card');

// Get user stats and leaderboard position
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Get user's card collection count
    const cardCount = await UserCard.countDocuments({ userId: req.userId });
    
    // Get total available cards
    const totalCards = await Card.countDocuments({ isActive: true });
    
    // Get user's rank based on level and experience
    const higherRankedUsers = await User.countDocuments({
      $or: [
        { level: { $gt: user.level } },
        { 
          level: user.level, 
          experience: { $gt: user.experience } 
        }
      ],
      isActive: true
    });
    
    const rank = higherRankedUsers + 1;

    res.json({
      user: {
        ...user.toObject(),
        cardCollection: {
          collected: cardCount,
          total: totalCards,
          percentage: totalCards > 0 ? Math.round((cardCount / totalCards) * 100) : 0
        },
        rank
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Error fetching user stats',
      error: error.message
    });
  }
};

// Get leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'level' } = req.query;
    
    const sortOptions = {
      level: { level: -1, experience: -1 },
      experience: { experience: -1 },
      coins: { coins: -1 },
      cards: { 'stats.cardsCollected': -1 }
    };

    const sort = sortOptions[sortBy] || sortOptions.level;
    
    const users = await User.find({ isActive: true })
      .select('username avatar level experience coins stats')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user.toObject(),
      rank: ((page - 1) * limit) + index + 1
    }));

    const totalUsers = await User.countDocuments({ isActive: true });

    res.json({
      leaderboard: usersWithRank,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
};

// Add coins to user (admin or reward system)
const addCoins = async (req, res) => {
  try {
    const { amount, reason } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    await user.addCoins(amount);

    res.json({
      message: `${amount} coins added successfully`,
      reason: reason || 'Manual addition',
      newBalance: user.coins
    });

  } catch (error) {
    console.error('Add coins error:', error);
    res.status(500).json({
      message: 'Error adding coins',
      error: error.message
    });
  }
};

// Spend coins
const spendCoins = async (req, res) => {
  try {
    const { amount, item } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    try {
      await user.spendCoins(amount);
      
      res.json({
        message: `${amount} coins spent successfully`,
        item: item || 'Unknown item',
        newBalance: user.coins
      });
    } catch (spendError) {
      return res.status(400).json({
        message: spendError.message
      });
    }

  } catch (error) {
    console.error('Spend coins error:', error);
    res.status(500).json({
      message: 'Error spending coins',
      error: error.message
    });
  }
};

// Add experience to user
const addExperience = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Amount must be a positive number'
      });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const oldLevel = user.level;
    await user.addExperience(amount);
    const newLevel = user.level;

    res.json({
      message: `${amount} experience added successfully`,
      experienceGained: amount,
      newExperience: user.experience,
      levelUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      expProgress: user.getExpForNextLevel()
    });

  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({
      message: 'Error adding experience',
      error: error.message
    });
  }
};

module.exports = {
  getUserStats,
  getLeaderboard,
  addCoins,
  spendCoins,
  addExperience
};