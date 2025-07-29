const mongoose = require('mongoose');
const Card = require('../models/Card');
require('dotenv').config();

const sampleCards = [
  // Common Cards
  {
    name: "Pikachu Básico",
    description: "Un Pokémon eléctrico pequeño pero poderoso",
    image: "/cards/pikachu-basic.png",
    rarity: "common",
    category: "character",
    stats: { attack: 20, defense: 15, health: 60, mana: 1 },
    abilities: [
      { name: "Impactrueno", description: "Ataque eléctrico básico", cost: 1 }
    ],
    packType: "starter",
    dropRate: 25
  },
  {
    name: "Charmander",
    description: "Un Pokémon de fuego con gran potencial",
    image: "/cards/charmander.png",
    rarity: "common",
    category: "character",
    stats: { attack: 18, defense: 12, health: 55, mana: 1 },
    abilities: [
      { name: "Ascuas", description: "Lanza pequeñas llamas", cost: 1 }
    ],
    packType: "starter",
    dropRate: 25
  },
  {
    name: "Squirtle",
    description: "Un Pokémon de agua defensivo",
    image: "/cards/squirtle.png",
    rarity: "common",
    category: "character",
    stats: { attack: 15, defense: 20, health: 65, mana: 1 },
    abilities: [
      { name: "Pistola Agua", description: "Dispara un chorro de agua", cost: 1 }
    ],
    packType: "starter",
    dropRate: 25
  },
  {
    name: "Bulbasaur",
    description: "Un Pokémon planta con habilidades curativas",
    image: "/cards/bulbasaur.png",
    rarity: "common",
    category: "character",
    stats: { attack: 16, defense: 18, health: 70, mana: 1 },
    abilities: [
      { name: "Látigo Cepa", description: "Ataca con enredaderas", cost: 1 }
    ],
    packType: "starter",
    dropRate: 25
  },
  {
    name: "Poción",
    description: "Restaura 20 puntos de salud",
    image: "/cards/potion.png",
    rarity: "common",
    category: "item",
    stats: { attack: 0, defense: 0, health: 0, mana: 1 },
    abilities: [
      { name: "Curar", description: "Restaura 20 HP", cost: 1 }
    ],
    packType: "booster",
    dropRate: 20
  },

  // Rare Cards
  {
    name: "Raichu",
    description: "La evolución de Pikachu con poder eléctrico intenso",
    image: "/cards/raichu.png",
    rarity: "rare",
    category: "character",
    stats: { attack: 35, defense: 25, health: 90, mana: 2 },
    abilities: [
      { name: "Rayo", description: "Ataque eléctrico poderoso", cost: 2 },
      { name: "Agilidad", description: "Aumenta la velocidad", cost: 1 }
    ],
    packType: "booster",
    dropRate: 15
  },
  {
    name: "Charizard",
    description: "Un dragón de fuego legendario",
    image: "/cards/charizard.png",
    rarity: "rare",
    category: "character",
    stats: { attack: 40, defense: 30, health: 120, mana: 3 },
    abilities: [
      { name: "Lanzallamas", description: "Ataque de fuego devastador", cost: 3 },
      { name: "Vuelo", description: "Evita ataques terrestres", cost: 2 }
    ],
    packType: "premium",
    dropRate: 12
  },
  {
    name: "Blastoise",
    description: "Una tortuga de agua con cañones poderosos",
    image: "/cards/blastoise.png",
    rarity: "rare",
    category: "character",
    stats: { attack: 38, defense: 35, health: 130, mana: 3 },
    abilities: [
      { name: "Hidrobomba", description: "Ataque de agua masivo", cost: 3 },
      { name: "Refugio", description: "Aumenta la defensa", cost: 1 }
    ],
    packType: "premium",
    dropRate: 12
  },
  {
    name: "Venusaur",
    description: "Una planta gigante con poderes naturales",
    image: "/cards/venusaur.png",
    rarity: "rare",
    category: "character",
    stats: { attack: 36, defense: 32, health: 140, mana: 3 },
    abilities: [
      { name: "Rayo Solar", description: "Ataque de energía solar", cost: 3 },
      { name: "Síntesis", description: "Recupera salud", cost: 2 }
    ],
    packType: "premium",
    dropRate: 12
  },

  // Epic Cards
  {
    name: "Mewtwo",
    description: "Un Pokémon psíquico creado artificialmente",
    image: "/cards/mewtwo.png",
    rarity: "epic",
    category: "character",
    stats: { attack: 50, defense: 40, health: 150, mana: 4 },
    abilities: [
      { name: "Psíquico", description: "Ataque mental devastador", cost: 3 },
      { name: "Barrera", description: "Bloquea ataques", cost: 2 },
      { name: "Recuperación", description: "Restaura toda la salud", cost: 4 }
    ],
    packType: "premium",
    dropRate: 8
  },
  {
    name: "Mew",
    description: "El Pokémon ancestral con todos los genes",
    image: "/cards/mew.png",
    rarity: "epic",
    category: "character",
    stats: { attack: 45, defense: 45, health: 120, mana: 3 },
    abilities: [
      { name: "Transformación", description: "Copia habilidades enemigas", cost: 2 },
      { name: "Psicorrayo", description: "Ataque psíquico", cost: 3 }
    ],
    packType: "special",
    dropRate: 6
  },
  {
    name: "Dragonite",
    description: "Un dragón benévolo con increíble poder",
    image: "/cards/dragonite.png",
    rarity: "epic",
    category: "character",
    stats: { attack: 48, defense: 38, health: 160, mana: 4 },
    abilities: [
      { name: "Hiperrayo", description: "Ataque devastador", cost: 4 },
      { name: "Danza Dragón", description: "Aumenta ataque y velocidad", cost: 2 }
    ],
    packType: "premium",
    dropRate: 7
  },

  // Legendary Cards
  {
    name: "Arceus",
    description: "El Pokémon creador del universo",
    image: "/cards/arceus.png",
    rarity: "legendary",
    category: "character",
    stats: { attack: 60, defense: 50, health: 200, mana: 5 },
    abilities: [
      { name: "Juicio", description: "Ataque definitivo", cost: 5 },
      { name: "Multitipo", description: "Cambia de tipo", cost: 2 },
      { name: "Recuperación Divina", description: "Restaura toda la salud del equipo", cost: 4 }
    ],
    packType: "special",
    dropRate: 2
  },
  {
    name: "Rayquaza",
    description: "El dragón del cielo que controla el clima",
    image: "/cards/rayquaza.png",
    rarity: "legendary",
    category: "character",
    stats: { attack: 65, defense: 45, health: 180, mana: 5 },
    abilities: [
      { name: "Ascenso Draco", description: "Ataque dragón supremo", cost: 5 },
      { name: "Danza Aérea", description: "Vuela por encima de todo", cost: 3 }
    ],
    packType: "special",
    dropRate: 1
  },

  // Location Cards
  {
    name: "Centro Pokémon",
    description: "Lugar de curación y descanso",
    image: "/cards/pokemon-center.png",
    rarity: "common",
    category: "location",
    stats: { attack: 0, defense: 0, health: 0, mana: 2 },
    abilities: [
      { name: "Curación Completa", description: "Restaura toda la salud del equipo", cost: 2 }
    ],
    packType: "booster",
    dropRate: 15
  },
  {
    name: "Monte Plateado",
    description: "Una montaña mística llena de poder",
    image: "/cards/silver-mountain.png",
    rarity: "rare",
    category: "location",
    stats: { attack: 0, defense: 0, health: 0, mana: 3 },
    abilities: [
      { name: "Poder Místico", description: "Aumenta el ataque de todos los Pokémon", cost: 3 }
    ],
    packType: "premium",
    dropRate: 10
  },

  // Spell Cards
  {
    name: "Superpoción",
    description: "Poción mejorada que restaura más salud",
    image: "/cards/super-potion.png",
    rarity: "rare",
    category: "spell",
    stats: { attack: 0, defense: 0, health: 0, mana: 2 },
    abilities: [
      { name: "Curación Avanzada", description: "Restaura 50 HP", cost: 2 }
    ],
    packType: "booster",
    dropRate: 12
  },
  {
    name: "Revivir",
    description: "Revive a un Pokémon debilitado",
    image: "/cards/revive.png",
    rarity: "epic",
    category: "spell",
    stats: { attack: 0, defense: 0, health: 0, mana: 3 },
    abilities: [
      { name: "Resurrección", description: "Revive con 50% de HP", cost: 3 }
    ],
    packType: "premium",
    dropRate: 5
  }
];

const seedCards = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pibardex');
    console.log('✅ Connected to MongoDB');

    // Clear existing cards
    await Card.deleteMany({});
    console.log('🗑️ Cleared existing cards');

    // Insert sample cards
    const insertedCards = await Card.insertMany(sampleCards);
    console.log(`✅ Inserted ${insertedCards.length} cards`);

    // Display summary
    const cardsByRarity = await Card.aggregate([
      { $group: { _id: '$rarity', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Cards by rarity:');
    cardsByRarity.forEach(item => {
      console.log(`  ${item._id}: ${item.count} cards`);
    });

    const cardsByCategory = await Card.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 Cards by category:');
    cardsByCategory.forEach(item => {
      console.log(`  ${item._id}: ${item.count} cards`);
    });

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedCards();
}

module.exports = { seedCards, sampleCards };