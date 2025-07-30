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

    // Map cards to include imageUrl field for frontend compatibility
    const mappedCards = cards.map(card => ({
      ...card.toObject(),
      imageUrl: card.image,
      power: card.stats?.attack,
      health: card.stats?.health,
      cost: card.stats?.mana
    }));

    res.json({
      cards: mappedCards,
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

    const { generateUpgradedCardData } = require('../utils/cardUpgradeHelper');

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

    // Map user cards to include imageUrl field and upgrade data when applicable
    const mappedUserCards = validUserCards.map(userCard => {
      let cardData = userCard.cardId.toObject();
      
      // If user has upgraded this card, generate upgraded data
      if (userCard.isUpgraded && userCard.upgradeLevel > 0) {
        cardData = generateUpgradedCardData(cardData, userCard.upgradeLevel);
      }

      return {
        ...userCard.toObject(),
        cardId: {
          ...cardData,
          imageUrl: cardData.image,
          power: cardData.stats?.attack,
          health: cardData.stats?.health,
          cost: cardData.stats?.mana
        }
      };
    });

    const totalUserCards = await UserCard.countDocuments(filter);

    res.json({
      userCards: mappedUserCards,
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
    
    // Pack costs and card counts with specific rarity guarantees
    const packConfig = {
      starter: { 
        cost: 50, 
        cardCount: 2,
        rarityDistribution: [
          { rarity: 'common', count: 2 }
        ]
      },
      booster: { 
        cost: 100, 
        cardCount: 3,
        rarityDistribution: [
          { rarity: 'common', count: 2 },
          { rarity: 'rare', count: 1 }
        ]
      },
      premium: { 
        cost: 200, 
        cardCount: 3,
        rarityDistribution: [
          { rarity: 'common', count: 2 },
          { rarity: 'epic', count: 1 }
        ]
      },
      special: { 
        cost: 350, 
        cardCount: 3,
        rarityDistribution: [
          { rarity: 'common', count: 2 },
          { rarity: 'special', count: 1 } // Special means epic or legendary with low chance
        ]
      }
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

    const obtainedCards = [];
    
    // Generate cards based on specific rarity distribution
    for (const rarityConfig of config.rarityDistribution) {
      for (let i = 0; i < rarityConfig.count; i++) {
        let selectedRarity = rarityConfig.rarity;
        
        // Special handling for 'special' rarity (epic or legendary)
        if (selectedRarity === 'special') {
          // 15% chance for legendary, 85% chance for epic
          const random = Math.random();
          selectedRarity = random < 0.15 ? 'legendary' : 'epic';
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
          // Populate cardId for consistency
          await existingUserCard.populate('cardId');
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

    // Map cards to include imageUrl field for frontend compatibility
    const mappedCards = newUserCards.map(userCard => {
      // Ensure cardId is populated
      if (!userCard.cardId || typeof userCard.cardId === 'string') {
        console.error('UserCard cardId not properly populated:', userCard);
        return null;
      }

      return {
        ...userCard.toObject(),
        cardId: {
          ...(userCard.cardId.toObject ? userCard.cardId.toObject() : userCard.cardId),
          imageUrl: userCard.cardId.image,
          power: userCard.cardId.stats?.attack,
          health: userCard.cardId.stats?.health,
          cost: userCard.cardId.stats?.mana
        }
      };
    }).filter(card => card !== null); // Remove any null entries

    res.json({
      message: 'Pack opened successfully',
      packType,
      cost: config.cost,
      cards: mappedCards,
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

// Upgrade card using duplicates - Marks UserCard as upgraded without modifying original card
const upgradeCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { generateUpgradedCardData, getUpgradeRequirements, canCardBeUpgraded } = require('../utils/cardUpgradeHelper');
    
    // Validate cardId
    console.log('Upgrade card request - cardId:', cardId, 'type:', typeof cardId);
    
    if (!cardId || cardId === 'undefined' || cardId === 'null') {
      return res.status(400).json({
        message: 'Valid card ID is required',
        received: cardId
      });
    }
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // First, find the card by cardNumber to get its _id
    const foundCard = await Card.findOne({ cardNumber: cardId });
    if (!foundCard) {
      return res.status(404).json({
        message: 'Card not found',
        cardNumber: cardId
      });
    }

    // Find the user's card using the actual card _id
    const userCard = await UserCard.findOne({
      userId: req.userId,
      cardId: foundCard._id
    }).populate('cardId');

    if (!userCard) {
      return res.status(404).json({
        message: 'Card not found in user collection'
      });
    }

    const card = userCard.cardId;
    
    // Check if card is already upgraded
    if (userCard.isUpgraded) {
      return res.status(400).json({
        message: 'This card is already upgraded to Holo version'
      });
    }
    
    // Check if card can be upgraded
    if (!canCardBeUpgraded(card.rarity)) {
      return res.status(400).json({
        message: 'This card cannot be upgraded'
      });
    }

    // Get upgrade requirements
    const upgradeConfig = getUpgradeRequirements(card.rarity);
    if (!upgradeConfig) {
      return res.status(400).json({
        message: 'This card cannot be upgraded'
      });
    }

    // Check if user has enough duplicates
    if (userCard.quantity < upgradeConfig.required) {
      return res.status(400).json({
        message: `You need ${upgradeConfig.required} copies of this card to upgrade it. You have ${userCard.quantity}.`,
        required: upgradeConfig.required,
        current: userCard.quantity
      });
    }

    // Consume the required cards
    const newQuantity = userCard.quantity - upgradeConfig.required;
    
    // Mark the UserCard as upgraded
    userCard.isUpgraded = true;
    userCard.upgradeLevel = 1;
    userCard.upgradedAt = new Date();
    userCard.quantity = newQuantity > 0 ? newQuantity : 1; // Keep at least 1 for the upgraded version
    userCard.isNew = true; // Mark as new to show the upgrade
    await userCard.save();

    // Add experience and update stats
    await user.addExperience(upgradeConfig.experience);
    user.stats.cardsUpgraded = (user.stats.cardsUpgraded || 0) + 1;
    await user.save();

    // Generate upgraded card data for response
    const upgradedCardData = generateUpgradedCardData(card.toObject(), userCard.upgradeLevel);

    res.json({
      message: `Card upgraded successfully to Holo version!`,
      upgradedCard: upgradedCardData,
      experienceGained: upgradeConfig.experience,
      remainingQuantity: userCard.quantity,
      upgradeLevel: userCard.upgradeLevel
    });

  } catch (error) {
    console.error('Upgrade card error:', error);
    res.status(500).json({
      message: 'Error upgrading card',
      error: error.message
    });
  }
};

module.exports = {
  getAllCards,
  getUserCards,
  openPack,
  toggleFavorite,
  markCardsAsSeen,
  upgradeCard
};