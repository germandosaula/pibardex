const Card = require('../models/Card');
const UserCard = require('../models/UserCard');
const User = require('../models/User');

// Get all available cards (catalog)
const getAllCards = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      rarity, 
      category, 
      packType,
      search 
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (rarity) filter.rarity = rarity;
    if (category) filter.category = category;
    if (packType) filter.packType = packType;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const cards = await Card.find(filter)
      .sort({ rarity: 1, name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalCards = await Card.countDocuments(filter);

    res.json({
      cards,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCards / limit),
        totalCards,
        hasNext: page * limit < totalCards,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all cards error:', error);
    res.status(500).json({
      message: 'Error fetching cards',
      error: error.message
    });
  }
};

// Get user's card collection
const getUserCards = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      rarity, 
      category,
      isFavorite,
      isNew 
    } = req.query;

    // Build filter object
    const filter = { userId: req.userId };
    
    if (isFavorite !== undefined) filter.isFavorite = isFavorite === 'true';
    if (isNew !== undefined) filter.isNew = isNew === 'true';

    const userCards = await UserCard.find(filter)
      .populate({
        path: 'cardId',
        match: {
          isActive: true,
          ...(rarity && { rarity }),
          ...(category && { category })
        }
      })
      .sort({ obtainedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter out null cardId (when populate doesn't match)
    const validUserCards = userCards.filter(uc => uc.cardId);

    const totalUserCards = await UserCard.countDocuments(filter);

    res.json({
      userCards: validUserCards,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUserCards / limit),
        totalCards: totalUserCards,
        hasNext: page * limit < totalUserCards,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user cards error:', error);
    res.status(500).json({
      message: 'Error fetching user cards',
      error: error.message
    });
  }
};

// Open a card pack
const openPack = async (req, res) => {
  try {
    const { packType = 'booster' } = req.body;
    
    // Pack costs and card counts
    const packConfig = {
      starter: { cost: 50, cardCount: 3 },
      booster: { cost: 100, cardCount: 5 },
      premium: { cost: 250, cardCount: 8 },
      special: { cost: 500, cardCount: 10 }
    };

    const config = packConfig[packType];
    if (!config) {
      return res.status(400).json({
        message: 'Invalid pack type'
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Check if user has enough coins
    if (user.coins < config.cost) {
      return res.status(400).json({
        message: 'Insufficient coins',
        required: config.cost,
        current: user.coins
      });
    }

    // Get available cards for this pack type
    const availableCards = await Card.find({ 
      packType: { $in: [packType, 'starter'] }, // Include starter cards in all packs
      isActive: true 
    });

    if (availableCards.length === 0) {
      return res.status(400).json({
        message: 'No cards available for this pack type'
      });
    }

    // Generate random cards based on rarity weights
    const rarityWeights = {
      common: 60,
      rare: 25,
      epic: 12,
      legendary: 3
    };

    const obtainedCards = [];
    
    for (let i = 0; i < config.cardCount; i++) {
      // Determine rarity based on weights
      const random = Math.random() * 100;
      let selectedRarity = 'common';
      let cumulativeWeight = 0;
      
      for (const [rarity, weight] of Object.entries(rarityWeights)) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) {
          selectedRarity = rarity;
          break;
        }
      }

      // Get cards of selected rarity
      const cardsOfRarity = availableCards.filter(card => card.rarity === selectedRarity);
      
      if (cardsOfRarity.length === 0) {
        // Fallback to common if no cards of selected rarity
        const commonCards = availableCards.filter(card => card.rarity === 'common');
        if (commonCards.length > 0) {
          const randomCard = commonCards[Math.floor(Math.random() * commonCards.length)];
          obtainedCards.push(randomCard);
        }
      } else {
        const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        obtainedCards.push(randomCard);
      }
    }

    // Add cards to user's collection
    const newUserCards = [];
    
    for (const card of obtainedCards) {
      try {
        // Check if user already has this card
        const existingUserCard = await UserCard.findOne({
          userId: req.userId,
          cardId: card._id
        });

        if (existingUserCard) {
          // Increase quantity
          existingUserCard.quantity += 1;
          existingUserCard.isNew = true;
          await existingUserCard.save();
          newUserCards.push(existingUserCard);
        } else {
          // Create new user card
          const userCard = new UserCard({
            userId: req.userId,
            cardId: card._id,
            obtainedFrom: 'pack'
          });
          await userCard.save();
          await userCard.populate('cardId');
          newUserCards.push(userCard);
        }
      } catch (error) {
        console.error('Error adding card to user collection:', error);
      }
    }

    // Deduct coins and update stats
    await user.spendCoins(config.cost);
    user.stats.packsOpened += 1;
    user.stats.cardsCollected += obtainedCards.length;
    await user.addExperience(config.cardCount * 10); // 10 XP per card

    res.json({
      message: 'Pack opened successfully',
      packType,
      cost: config.cost,
      cards: newUserCards,
      newBalance: user.coins,
      experienceGained: config.cardCount * 10
    });

  } catch (error) {
    console.error('Open pack error:', error);
    res.status(500).json({
      message: 'Error opening pack',
      error: error.message
    });
  }
};

// Toggle favorite status of a card
const toggleFavorite = async (req, res) => {
  try {
    const { cardId } = req.params;
    
    const userCard = await UserCard.findOne({
      userId: req.userId,
      cardId
    }).populate('cardId');

    if (!userCard) {
      return res.status(404).json({
        message: 'Card not found in user collection'
      });
    }

    userCard.isFavorite = !userCard.isFavorite;
    await userCard.save();

    res.json({
      message: `Card ${userCard.isFavorite ? 'added to' : 'removed from'} favorites`,
      userCard
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      message: 'Error toggling favorite status',
      error: error.message
    });
  }
};

// Mark cards as seen (remove new status)
const markCardsAsSeen = async (req, res) => {
  try {
    const { cardIds } = req.body;
    
    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({
        message: 'Card IDs array is required'
      });
    }

    await UserCard.updateMany(
      {
        userId: req.userId,
        cardId: { $in: cardIds }
      },
      { isNew: false }
    );

    res.json({
      message: 'Cards marked as seen',
      updatedCount: cardIds.length
    });

  } catch (error) {
    console.error('Mark cards as seen error:', error);
    res.status(500).json({
      message: 'Error marking cards as seen',
      error: error.message
    });
  }
};

module.exports = {
  getAllCards,
  getUserCards,
  openPack,
  toggleFavorite,
  markCardsAsSeen
};