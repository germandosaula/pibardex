const mongoose = require('mongoose');
const Card = require('../models/Card');
const UserCard = require('../models/UserCard');

/**
 * Migration script to clean up cards that were incorrectly upgraded
 * This script will:
 * 1. Find cards that have isUpgraded=true or have Holo in their name/image
 * 2. Reset them to their original state
 * 3. Update UserCard records to reflect the upgrade status properly
 */

const cleanupUpgradedCards = async () => {
  try {
    console.log('Starting card upgrade cleanup migration...');

    // Find cards that appear to be upgraded (have Holo in name or upgraded image path)
    const upgradedCards = await Card.find({
      $or: [
        { name: { $regex: '⭐', $options: 'i' } },
        { image: { $regex: '/cards/upgraded/', $options: 'i' } },
        { description: { $regex: 'Versión Holo', $options: 'i' } }
      ]
    });

    console.log(`Found ${upgradedCards.length} cards that appear to be upgraded`);

    for (const card of upgradedCards) {
      console.log(`Processing card: ${card.name} (${card.cardNumber})`);

      // Extract original data
      const originalName = card.name.replace(' ⭐', '');
      const originalDescription = card.description.replace(' (Versión Holo)', '');
      const originalImage = card.image.replace('/cards/upgraded/', '/cards/').replace('Holo.png', '.png');

      // Calculate original stats (reverse the 10% boost)
      let originalStats = { ...card.stats };
      if (card.stats) {
        originalStats = {
          attack: Math.floor(card.stats.attack / 1.1),
          defense: Math.floor(card.stats.defense / 1.1),
          health: Math.floor(card.stats.health / 1.1),
          mana: card.stats.mana // Mana doesn't change
        };
      }

      // Update the card to its original state
      await Card.findByIdAndUpdate(card._id, {
        name: originalName,
        description: originalDescription,
        image: originalImage,
        stats: originalStats,
        $unset: {
          isUpgraded: 1,
          upgradeLevel: 1,
          originalCardId: 1,
          upgradedImage: 1
        }
      });

      // Find all UserCards that reference this card and mark them as upgraded
      const userCards = await UserCard.find({ cardId: card._id });
      
      for (const userCard of userCards) {
        // Mark the UserCard as upgraded if it wasn't already
        if (!userCard.isUpgraded) {
          await UserCard.findByIdAndUpdate(userCard._id, {
            isUpgraded: true,
            upgradeLevel: 1,
            upgradedAt: new Date()
          });
          console.log(`  - Marked UserCard ${userCard._id} as upgraded`);
        }
      }

      console.log(`  - Restored card ${originalName} to original state`);
    }

    console.log('Card upgrade cleanup migration completed successfully!');
    
  } catch (error) {
    console.error('Error during card upgrade cleanup migration:', error);
    throw error;
  }
};

// Run the migration if this file is executed directly
if (require.main === module) {
  const runMigration = async () => {
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pibardex');
      console.log('Connected to MongoDB');

      await cleanupUpgradedCards();

      console.log('Migration completed successfully!');
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  };

  runMigration();
}

module.exports = { cleanupUpgradedCards };