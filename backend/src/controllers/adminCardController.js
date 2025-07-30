const Card = require('../models/Card');
const UserCard = require('../models/UserCard');

// Get all cards with pagination
const getAllCards = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const rarity = req.query.rarity;
    const category = req.query.category;
    const packType = req.query.packType;

    // Build filter query
    const filterQuery = {};
    if (search) {
      filterQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (rarity) filterQuery.rarity = rarity;
    if (category) filterQuery.category = category;
    if (packType) filterQuery.packType = packType;

    // Get cards with pagination
    const cards = await Card.find(filterQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Card.countDocuments(filterQuery);

    res.json({
      cards,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
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

// Get card by ID
const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({
        message: 'Card not found'
      });
    }

    res.json({
      card
    });

  } catch (error) {
    console.error('Get card by ID error:', error);
    res.status(500).json({
      message: 'Error fetching card',
      error: error.message
    });
  }
};

// Create new card
const createCard = async (req, res) => {
  try {
    const {
      cardNumber,
      name,
      description,
      image,
      rarity,
      category,
      stats,
      abilities,
      packType,
      dropRate,
      isActive
    } = req.body;

    // Create new card
    const card = new Card({
      cardNumber,
      name,
      description,
      image,
      rarity,
      category,
      stats: stats || undefined,
      abilities: abilities || undefined,
      packType,
      dropRate,
      isActive: isActive !== undefined ? isActive : true
    });

    await card.save();

    res.status(201).json({
      message: 'Card created successfully',
      card
    });

  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({
      message: 'Error creating card',
      error: error.message
    });
  }
};

// Update card
const updateCard = async (req, res) => {
  try {
    const {
      cardNumber,
      name,
      description,
      image,
      rarity,
      category,
      stats,
      abilities,
      packType,
      dropRate,
      isActive
    } = req.body;
    
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({
        message: 'Card not found'
      });
    }

    // Update fields if provided
    if (cardNumber !== undefined) card.cardNumber = cardNumber;
    if (name !== undefined) card.name = name;
    if (description !== undefined) card.description = description;
    if (image !== undefined) card.image = image;
    if (rarity !== undefined) card.rarity = rarity;
    if (category !== undefined) card.category = category;
    if (stats !== undefined) card.stats = { ...card.stats, ...stats };
    if (abilities !== undefined) card.abilities = abilities;
    if (packType !== undefined) card.packType = packType;
    if (dropRate !== undefined) card.dropRate = dropRate;
    if (isActive !== undefined) card.isActive = isActive;

    await card.save();

    res.json({
      message: 'Card updated successfully',
      card
    });

  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({
      message: 'Error updating card',
      error: error.message
    });
  }
};

// Delete card
const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({
        message: 'Card not found'
      });
    }

    // Check if card is used by any user
    const userCardCount = await UserCard.countDocuments({ cardId: card._id });
    
    if (userCardCount > 0) {
      // Instead of deleting, set isActive to false
      card.isActive = false;
      await card.save();
      
      return res.json({
        message: 'Card deactivated successfully (card is in use by users)'
      });
    }

    // If not used by any user, can be deleted
    await Card.deleteOne({ _id: card._id });

    res.json({
      message: 'Card deleted successfully'
    });

  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({
      message: 'Error deleting card',
      error: error.message
    });
  }
};

// Force delete card (removes completely even if in use)
const forceDeleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({
        message: 'Card not found'
      });
    }

    // Remove from all user collections first
    const deleteUserCardsResult = await UserCard.deleteMany({ cardId: card._id });
    
    // Then delete the card itself
    await Card.deleteOne({ _id: card._id });

    res.json({
      message: 'Card force deleted successfully',
      removedFromUsers: deleteUserCardsResult.deletedCount
    });

  } catch (error) {
    console.error('Force delete card error:', error);
    res.status(500).json({
      message: 'Error force deleting card',
      error: error.message
    });
  }
};

// Get card statistics
const getCardStats = async (req, res) => {
  try {
    // Get total cards count
    const totalCards = await Card.countDocuments();
    
    // Get active cards count
    const activeCards = await Card.countDocuments({ isActive: true });
    
    // Get cards by rarity
    const cardsByRarity = await Card.aggregate([
      { $group: { _id: "$rarity", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get cards by category
    const cardsByCategory = await Card.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get cards by pack type
    const cardsByPackType = await Card.aggregate([
      { $group: { _id: "$packType", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get most collected cards
    const mostCollectedCards = await UserCard.aggregate([
      { $group: { _id: "$cardId", count: { $sum: "$quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'cards', localField: '_id', foreignField: '_id', as: 'card' } },
      { $unwind: "$card" },
      { $project: { _id: 0, card: 1, count: 1 } }
    ]);

    res.json({
      stats: {
        totalCards,
        activeCards,
        cardsByRarity,
        cardsByCategory,
        cardsByPackType,
        mostCollectedCards
      }
    });

  } catch (error) {
    console.error('Get card stats error:', error);
    res.status(500).json({
      message: 'Error fetching card statistics',
      error: error.message
    });
  }
};

// Clear all cards (for development purposes)
const clearAllCards = async (req, res) => {
  try {
    // Delete all cards
    const deleteResult = await Card.deleteMany({});
    
    // Also clear all user cards
    const deleteUserCardsResult = await UserCard.deleteMany({});

    res.json({
      message: 'All cards cleared successfully',
      deletedCards: deleteResult.deletedCount,
      deletedUserCards: deleteUserCardsResult.deletedCount
    });

  } catch (error) {
    console.error('Clear all cards error:', error);
    res.status(500).json({
      message: 'Error clearing all cards',
      error: error.message
    });
  }
};

module.exports = {
  getAllCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  forceDeleteCard,
  getCardStats,
  clearAllCards
};