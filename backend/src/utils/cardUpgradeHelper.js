/**
 * Helper functions for card upgrade system
 */

/**
 * Generate upgraded card data based on original card and upgrade level
 * @param {Object} originalCard - The original card data
 * @param {Number} upgradeLevel - The upgrade level (1 for Holo)
 * @returns {Object} - Enhanced card data with upgrade modifications
 */
const generateUpgradedCardData = (originalCard, upgradeLevel = 1) => {
  if (!originalCard || upgradeLevel < 1) {
    return originalCard;
  }

  // Clone the original card to avoid mutations
  const upgradedCard = JSON.parse(JSON.stringify(originalCard));

  // Generate Holo image path
  const baseCardNumber = originalCard.cardNumber;
  const holoImagePath = `/cards/upgraded/${baseCardNumber}Holo.png`;

  // Apply upgrade modifications
  upgradedCard.image = holoImagePath;
  upgradedCard.name = originalCard.name + ' ⭐';
  upgradedCard.description = originalCard.description + ' (Versión Holo)';
  
  // Improve stats by 10% for level 1 upgrade
  if (originalCard.stats) {
    const statBoost = 1 + (upgradeLevel * 0.1);
    upgradedCard.stats = {
      attack: Math.floor(originalCard.stats.attack * statBoost),
      defense: Math.floor(originalCard.stats.defense * statBoost),
      health: Math.floor(originalCard.stats.health * statBoost),
      mana: originalCard.stats.mana // Mana doesn't change
    };
  }

  // Add upgrade metadata
  upgradedCard.isUpgraded = true;
  upgradedCard.upgradeLevel = upgradeLevel;

  return upgradedCard;
};

/**
 * Get upgrade requirements based on card rarity
 * @param {String} rarity - Card rarity (common, rare, epic, legendary)
 * @returns {Object} - Upgrade configuration
 */
const getUpgradeRequirements = (rarity) => {
  const upgradeConfig = {
    common: { required: 10, experience: 100 },
    rare: { required: 8, experience: 200 },
    epic: { required: 5, experience: 350 },
    legendary: { required: 3, experience: 500 }
  };

  return upgradeConfig[rarity] || null;
};

/**
 * Check if a card can be upgraded
 * @param {String} rarity - Card rarity
 * @returns {Boolean} - Whether the card can be upgraded
 */
const canCardBeUpgraded = (rarity) => {
  return ['common', 'rare', 'epic', 'legendary'].includes(rarity);
};

module.exports = {
  generateUpgradedCardData,
  getUpgradeRequirements,
  canCardBeUpgraded
};