const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Card = require('../models/Card');
const UserCard = require('../models/UserCard');

// Start a new game session
const startGameSession = async (req, res) => {
  try {
    const { gameType, gameData = {} } = req.body;
    
    if (!['memory', 'spin_wheel', 'pack_opening'].includes(gameType)) {
      return res.status(400).json({
        message: 'Invalid game type'
      });
    }

    const gameSession = new GameSession({
      userId: req.userId,
      gameType,
      gameData
    });

    await gameSession.save();

    res.status(201).json({
      message: 'Game session started',
      sessionId: gameSession._id,
      gameType,
      startedAt: gameSession.startedAt
    });

  } catch (error) {
    console.error('Start game session error:', error);
    res.status(500).json({
      message: 'Error starting game session',
      error: error.message
    });
  }
};

// Complete a game session
const completeGameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { 
      won = false, 
      score = 0, 
      gameData = {},
      duration = 0 
    } = req.body;

    const gameSession = await GameSession.findOne({
      _id: sessionId,
      userId: req.userId,
      status: 'in_progress'
    });

    if (!gameSession) {
      return res.status(404).json({
        message: 'Game session not found or already completed'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Calculate rewards based on game type and performance
    let coinsEarned = 0;
    let experienceEarned = 0;
    const cardsObtained = [];

    switch (gameSession.gameType) {
      case 'memory':
        if (won) {
          const baseReward = 50;
          const difficultyMultiplier = gameData.difficulty === 'hard' ? 2 : gameData.difficulty === 'medium' ? 1.5 : 1;
          const timeBonus = Math.max(0, Math.floor((300 - duration) / 10)); // Bonus for completing quickly
          
          coinsEarned = Math.floor(baseReward * difficultyMultiplier) + timeBonus;
          experienceEarned = Math.floor(coinsEarned * 0.8);
          
          // Chance to get a card for excellent performance
          if (duration < 120 && gameData.moves < 20) {
            const availableCards = await Card.find({ 
              rarity: 'common', 
              isActive: true 
            });
            
            if (availableCards.length > 0 && Math.random() < 0.3) { // 30% chance
              const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
              cardsObtained.push({ cardId: randomCard._id, quantity: 1 });
            }
          }
          
          user.stats.memoryGamesWon += 1;
        }
        break;

      case 'spin_wheel':
        // Rewards are determined by the spin result
        const spinRewards = {
          'coins_small': { coins: 25, experience: 10 },
          'coins_medium': { coins: 50, experience: 20 },
          'coins_large': { coins: 100, experience: 40 },
          'card_common': { coins: 10, experience: 15, cardRarity: 'common' },
          'card_rare': { coins: 20, experience: 30, cardRarity: 'rare' },
          'experience': { coins: 0, experience: 100 },
          'nothing': { coins: 5, experience: 5 }
        };

        const reward = spinRewards[gameData.spinResult] || spinRewards['nothing'];
        coinsEarned = reward.coins;
        experienceEarned = reward.experience;

        // Add card if spin result includes one
        if (reward.cardRarity) {
          const availableCards = await Card.find({ 
            rarity: reward.cardRarity, 
            isActive: true 
          });
          
          if (availableCards.length > 0) {
            const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
            cardsObtained.push({ cardId: randomCard._id, quantity: 1 });
          }
        }

        user.stats.spinWheelSpins += 1;
        break;

      case 'pack_opening':
        // Pack opening rewards are handled in the card controller
        experienceEarned = (gameData.packsOpened || 1) * 20;
        break;
    }

    // Add cards to user collection
    for (const cardData of cardsObtained) {
      try {
        const existingUserCard = await UserCard.findOne({
          userId: req.userId,
          cardId: cardData.cardId
        });

        if (existingUserCard) {
          existingUserCard.quantity += cardData.quantity;
          existingUserCard.isNew = true;
          await existingUserCard.save();
        } else {
          const userCard = new UserCard({
            userId: req.userId,
            cardId: cardData.cardId,
            quantity: cardData.quantity,
            obtainedFrom: gameSession.gameType
          });
          await userCard.save();
        }

        user.stats.cardsCollected += cardData.quantity;
      } catch (error) {
        console.error('Error adding card to collection:', error);
      }
    }

    // Update user stats and rewards
    if (coinsEarned > 0) {
      await user.addCoins(coinsEarned);
    }
    
    if (experienceEarned > 0) {
      await user.addExperience(experienceEarned);
    }

    user.stats.totalGamesPlayed += 1;
    await user.save();

    // Update game session
    gameSession.status = 'completed';
    gameSession.completedAt = new Date();
    gameSession.duration = duration;
    gameSession.score = score;
    gameSession.result = {
      won,
      coinsEarned,
      experienceEarned,
      cardsObtained
    };
    gameSession.gameData = { ...gameSession.gameData, ...gameData };

    await gameSession.save();

    res.json({
      message: 'Game session completed',
      session: gameSession,
      rewards: {
        coinsEarned,
        experienceEarned,
        cardsObtained: cardsObtained.length,
        newBalance: user.coins,
        newLevel: user.level,
        newExperience: user.experience
      }
    });

  } catch (error) {
    console.error('Complete game session error:', error);
    res.status(500).json({
      message: 'Error completing game session',
      error: error.message
    });
  }
};

// Get user's game history
const getGameHistory = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      gameType,
      status = 'completed'
    } = req.query;

    const filter = { 
      userId: req.userId,
      status
    };
    
    if (gameType) filter.gameType = gameType;

    const sessions = await GameSession.find(filter)
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('result.cardsObtained.cardId', 'name image rarity');

    const totalSessions = await GameSession.countDocuments(filter);

    res.json({
      sessions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalSessions / limit),
        totalSessions,
        hasNext: page * limit < totalSessions,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({
      message: 'Error fetching game history',
      error: error.message
    });
  }
};

// Get game statistics
const getGameStats = async (req, res) => {
  try {
    const stats = await GameSession.aggregate([
      { $match: { userId: req.userId, status: 'completed' } },
      {
        $group: {
          _id: '$gameType',
          totalGames: { $sum: 1 },
          gamesWon: { 
            $sum: { $cond: ['$result.won', 1, 0] } 
          },
          totalCoinsEarned: { $sum: '$result.coinsEarned' },
          totalExperienceEarned: { $sum: '$result.experienceEarned' },
          averageScore: { $avg: '$score' },
          bestScore: { $max: '$score' },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    // Calculate win rates and format stats
    const formattedStats = stats.map(stat => ({
      gameType: stat._id,
      totalGames: stat.totalGames,
      gamesWon: stat.gamesWon,
      winRate: stat.totalGames > 0 ? Math.round((stat.gamesWon / stat.totalGames) * 100) : 0,
      totalCoinsEarned: stat.totalCoinsEarned,
      totalExperienceEarned: stat.totalExperienceEarned,
      averageScore: Math.round(stat.averageScore || 0),
      bestScore: stat.bestScore || 0,
      totalDuration: stat.totalDuration,
      averageDuration: stat.totalGames > 0 ? Math.round(stat.totalDuration / stat.totalGames) : 0
    }));

    res.json({
      gameStats: formattedStats
    });

  } catch (error) {
    console.error('Get game stats error:', error);
    res.status(500).json({
      message: 'Error fetching game statistics',
      error: error.message
    });
  }
};

module.exports = {
  startGameSession,
  completeGameSession,
  getGameHistory,
  getGameStats
};