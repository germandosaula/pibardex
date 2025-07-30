const mongoose = require('mongoose');
const User = require('../models/User');
const Card = require('../models/Card');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pibardex');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Create test users
const createTestUsers = async () => {
  try {
    const testUsers = [
      {
        username: 'testuser1',
        email: 'test1@example.com',
        password: 'password123',
        coins: 1000,
        level: 5,
        experience: 2500,
        avatar: 'default-avatar.png',
        isActive: true
      },
      {
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123',
        coins: 500,
        level: 3,
        experience: 1200,
        avatar: 'default-avatar.png',
        isActive: true
      },
      {
        username: 'testuser3',
        email: 'test3@example.com',
        password: 'password123',
        coins: 2000,
        level: 8,
        experience: 4500,
        avatar: 'default-avatar.png',
        isActive: false
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`Created test user: ${userData.username}`);
      } else {
        console.log(`User ${userData.username} already exists`);
      }
    }
  } catch (error) {
    console.error('Error creating test users:', error);
  }
};

// Create test cards
const createTestCards = async () => {
  try {
    const testCards = [
      {
        name: 'Pikachu',
        description: 'Un Pokémon eléctrico muy popular',
        image: '/cards/pikachu.png',
        rarity: 'rare',
        category: 'character',
        stats: {
          attack: 80,
          defense: 60,
          health: 100,
          mana: 50
        },
        abilities: [
          { name: 'Thunder Shock', description: 'Ataque eléctrico básico', cost: 2 },
          { name: 'Quick Attack', description: 'Ataque rápido', cost: 1 }
        ],
        packType: 'booster',
        dropRate: 15,
        isActive: true
      },
      {
        name: 'Charizard',
        description: 'Un poderoso dragón de fuego',
        image: '/cards/charizard.png',
        rarity: 'legendary',
        category: 'character',
        stats: {
          attack: 120,
          defense: 90,
          health: 150,
          mana: 80
        },
        abilities: [
          { name: 'Fire Blast', description: 'Ataque de fuego devastador', cost: 5 },
          { name: 'Dragon Claw', description: 'Garra de dragón', cost: 3 },
          { name: 'Fly', description: 'Vuela alto para evitar ataques', cost: 2 }
        ],
        packType: 'premium',
        dropRate: 2,
        isActive: true
      },
      {
        name: 'Blastoise',
        description: 'Una tortuga de agua gigante',
        image: '/cards/blastoise.png',
        rarity: 'epic',
        category: 'character',
        stats: {
          attack: 100,
          defense: 120,
          health: 140,
          mana: 70
        },
        abilities: [
          { name: 'Hydro Pump', description: 'Chorro de agua a alta presión', cost: 4 },
          { name: 'Water Gun', description: 'Disparo de agua', cost: 2 },
          { name: 'Withdraw', description: 'Se retrae en su caparazón', cost: 1 }
        ],
        packType: 'premium',
        dropRate: 5,
        isActive: true
      },
      {
        name: 'Venusaur',
        description: 'Una planta gigante con poderes venenosos',
        image: '/cards/venusaur.png',
        rarity: 'epic',
        category: 'character',
        stats: {
          attack: 95,
          defense: 110,
          health: 135,
          mana: 75
        },
        abilities: [
          { name: 'Solar Beam', description: 'Rayo solar concentrado', cost: 4 },
          { name: 'Vine Whip', description: 'Látigo de enredaderas', cost: 2 },
          { name: 'Poison Powder', description: 'Polvo venenoso', cost: 3 }
        ],
        packType: 'premium',
        dropRate: 5,
        isActive: true
      },
      {
        name: 'Magikarp',
        description: 'Un pez débil pero con potencial',
        image: '/cards/magikarp.png',
        rarity: 'common',
        category: 'character',
        stats: {
          attack: 10,
          defense: 20,
          health: 50,
          mana: 20
        },
        abilities: [
          { name: 'Splash', description: 'Salpica agua sin efecto', cost: 1 }
        ],
        packType: 'starter',
        dropRate: 40,
        isActive: true
      },
      {
        name: 'Poción de Curación',
        description: 'Restaura la salud del personaje',
        image: '/cards/healing-potion.png',
        rarity: 'common',
        category: 'item',
        stats: {
          attack: 0,
          defense: 0,
          health: 0,
          mana: 0
        },
        abilities: [
          { name: 'Heal', description: 'Restaura 50 puntos de salud', cost: 2 }
        ],
        packType: 'booster',
        dropRate: 25,
        isActive: true
      },
      {
        name: 'Bola de Fuego',
        description: 'Un hechizo de fuego devastador',
        image: '/cards/fireball.png',
        rarity: 'rare',
        category: 'spell',
        stats: {
          attack: 0,
          defense: 0,
          health: 0,
          mana: 0
        },
        abilities: [
          { name: 'Fireball', description: 'Causa 80 puntos de daño de fuego', cost: 4 }
        ],
        packType: 'booster',
        dropRate: 12,
        isActive: true
      },
      {
        name: 'Castillo Místico',
        description: 'Una fortaleza mágica que otorga poder',
        image: '/cards/mystic-castle.png',
        rarity: 'epic',
        category: 'location',
        stats: {
          attack: 0,
          defense: 0,
          health: 0,
          mana: 0
        },
        abilities: [
          { name: 'Mystic Aura', description: 'Aumenta el maná de todos los aliados', cost: 0 }
        ],
        packType: 'special',
        dropRate: 3,
        isActive: true
      }
    ];

    for (const cardData of testCards) {
      const existingCard = await Card.findOne({ name: cardData.name });
      if (!existingCard) {
        const card = new Card(cardData);
        await card.save();
        console.log(`Created test card: ${cardData.name}`);
      } else {
        console.log(`Card ${cardData.name} already exists`);
      }
    }
  } catch (error) {
    console.error('Error creating test cards:', error);
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    console.log('Adding test data...');
    
    await createTestUsers();
    await createTestCards();
    
    console.log('Test data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test data:', error);
    process.exit(1);
  }
};

main();