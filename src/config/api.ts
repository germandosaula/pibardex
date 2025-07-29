// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile'
  },
  
  // Users
  USERS: {
    STATS: '/users/stats',
    LEADERBOARD: '/users/leaderboard',
    ADD_COINS: '/users/coins/add',
    SPEND_COINS: '/users/coins/spend',
    ADD_EXPERIENCE: '/users/experience/add'
  },
  
  // Cards
  CARDS: {
    CATALOG: '/cards/catalog',
    COLLECTION: '/cards/collection',
    OPEN_PACK: '/cards/open-pack',
    TOGGLE_FAVORITE: (cardId: string) => `/cards/${cardId}/favorite`,
    MARK_SEEN: '/cards/mark-seen'
  },
  
  // Games
  GAMES: {
    START: '/games/start',
    COMPLETE: (sessionId: string) => `/games/complete/${sessionId}`,
    HISTORY: '/games/history',
    STATS: '/games/stats'
  },
  
  // Utilities
  HEALTH: '/health'
};

// Pack Types and Costs
export const PACK_TYPES = {
  STARTER: { name: 'Starter Pack', cost: 50, cardCount: 3 },
  BOOSTER: { name: 'Booster Pack', cost: 100, cardCount: 5 },
  PREMIUM: { name: 'Premium Pack', cost: 250, cardCount: 8 },
  SPECIAL: { name: 'Special Pack', cost: 500, cardCount: 10 }
};

// Card Rarities
export const CARD_RARITIES = {
  COMMON: 'common',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

// Game Types
export const GAME_TYPES = {
  MEMORY: 'memory',
  SPIN_WHEEL: 'spin_wheel',
  PACK_OPENING: 'pack_opening'
};