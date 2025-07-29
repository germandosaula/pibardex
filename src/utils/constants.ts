// Configuración del juego
export const GAME_CONFIG = {
  // Sistema de monedas y experiencia
  COINS: {
    CLICK_TARGET_BASE: 10,
    RUNNER_BASE: 5,
    ROULETTE_COST: 50,
    PACK_PRICES: {
      basic: 100,
      premium: 250,
      legendary: 500,
    },
  },
  
  // Sistema de experiencia
  EXPERIENCE: {
    CARD_OBTAINED: 10,
    GAME_COMPLETED: 25,
    PACK_OPENED: 50,
    LEVEL_MULTIPLIER: 100,
  },
  
  // Configuración de minijuegos
  CLICK_TARGET: {
    GAME_DURATION: 30, // segundos
    TARGET_LIFETIME: 2, // segundos
    MIN_TARGETS: 1,
    MAX_TARGETS: 3,
    TARGET_SIZE_MIN: 40,
    TARGET_SIZE_MAX: 80,
    POINTS_PER_TARGET: 10,
    SPEED_BONUS_MULTIPLIER: 1.5,
  },
  
  RUNNER: {
    PLAYER_SPEED: 5,
    JUMP_HEIGHT: 100,
    JUMP_DURATION: 800, // ms
    OBSTACLE_SPEED: 3,
    OBSTACLE_SPAWN_RATE: 2000, // ms
    DISTANCE_MULTIPLIER: 0.1,
  },
  
  ROULETTE: {
    SPIN_DURATION: 3000, // ms
    SEGMENTS: [
      { label: '10 Monedas', probability: 0.3, reward: { type: 'coins', amount: 10 } },
      { label: '25 Monedas', probability: 0.25, reward: { type: 'coins', amount: 25 } },
      { label: '50 Monedas', probability: 0.15, reward: { type: 'coins', amount: 50 } },
      { label: 'Carta Común', probability: 0.15, reward: { type: 'card', rarity: 'common' } },
      { label: 'Carta Rara', probability: 0.08, reward: { type: 'card', rarity: 'rare' } },
      { label: 'Sobre Básico', probability: 0.05, reward: { type: 'pack', packType: 'basic' } },
      { label: 'Nada', probability: 0.02, reward: { type: 'nothing' } },
    ],
  },
  
  // Distribución de rareza en sobres
  PACK_RARITY_DISTRIBUTION: {
    basic: {
      common: 0.7,
      rare: 0.25,
      epic: 0.04,
      legendary: 0.01,
    },
    premium: {
      common: 0.5,
      rare: 0.35,
      epic: 0.12,
      legendary: 0.03,
    },
    legendary: {
      common: 0.3,
      rare: 0.4,
      epic: 0.25,
      legendary: 0.05,
    },
  },
};

// Colores de rareza
export const RARITY_COLORS = {
  common: '#9ca3af',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

// Personajes disponibles
export const CHARACTERS = [
  {
    id: 'warrior',
    name: 'Guerrero',
    description: 'Un valiente luchador con armadura brillante',
    modelUrl: '/assets/characters/warrior.glb',
    thumbnailUrl: '/assets/characters/warrior-thumb.png',
  },
  {
    id: 'mage',
    name: 'Mago',
    description: 'Un poderoso hechicero con conocimientos arcanos',
    modelUrl: '/assets/characters/mage.glb',
    thumbnailUrl: '/assets/characters/mage-thumb.png',
  },
  {
    id: 'archer',
    name: 'Arquero',
    description: 'Un hábil tirador con puntería perfecta',
    modelUrl: '/assets/characters/archer.glb',
    thumbnailUrl: '/assets/characters/archer-thumb.png',
  },
  {
    id: 'rogue',
    name: 'Pícaro',
    description: 'Un ágil ladrón que se mueve en las sombras',
    modelUrl: '/assets/characters/rogue.glb',
    thumbnailUrl: '/assets/characters/rogue-thumb.png',
  },
];

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHARACTER_SELECT: '/character-select',
  DASHBOARD: '/dashboard',
  GAMES: '/games',
  CLICK_TARGET: '/games/click-target',
  RUNNER: '/games/runner',
  ROULETTE: '/games/roulette',
  COLLECTION: '/collection',
  STORE: '/store',
  PROFILE: '/profile',
};

// Mensajes de la aplicación
export const MESSAGES = {
  WELCOME: '¡Bienvenido a Pibardex!',
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  REGISTER_SUCCESS: 'Registro exitoso',
  GAME_COMPLETED: '¡Juego completado!',
  COINS_EARNED: 'Monedas ganadas:',
  PACK_OPENED: '¡Sobre abierto!',
  CARD_OBTAINED: '¡Nueva carta obtenida!',
  LEVEL_UP: '¡Subiste de nivel!',
  ERROR_GENERIC: 'Ha ocurrido un error. Inténtalo de nuevo.',
  ERROR_NETWORK: 'Error de conexión. Verifica tu internet.',
  ERROR_AUTH: 'Error de autenticación. Inicia sesión nuevamente.',
};