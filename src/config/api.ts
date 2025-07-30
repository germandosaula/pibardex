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
    ADD_EXPERIENCE: '/users/experience/add',
    BUY_SKIN: '/users/skins/buy',
    SELECT_SKIN: '/users/skins/select'
  },
  
  // Cards
  CARDS: {
    CATALOG: '/cards/catalog',
    COLLECTION: '/cards/collection',
    OPEN_PACK: '/cards/open-pack',
    TOGGLE_FAVORITE: (cardId: string) => `/cards/${cardId}/favorite`,
    MARK_SEEN: '/cards/mark-seen',
    UPGRADE_CARD: (cardId: string) => `/cards/${cardId}/upgrade`
  },
  
  // Games
  GAMES: {
    START: '/games/start',
    COMPLETE: (sessionId: string) => `/games/complete/${sessionId}`,
    HISTORY: '/games/history',
    STATS: '/games/stats'
  },

  // Admin
  ADMIN: {
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USERS_STATS: '/admin/users/stats',
    CARDS: '/admin/cards',
    CARDS_STATS: '/admin/cards/stats',
    UPDATE_USER: (userId: string) => `/admin/users/${userId}`,
    DELETE_USER: (userId: string) => `/admin/users/${userId}`,
    UPDATE_CARD: (cardId: string) => `/admin/cards/${cardId}`,
    DELETE_CARD: (cardId: string) => `/admin/cards/${cardId}`,
    FORCE_DELETE_CARD: (cardId: string) => `/admin/cards/${cardId}/force`,
    CREATE_CARD: '/admin/cards',
    CLEAR_ALL_CARDS: '/admin/cards/clear-all'
  },

  // Utilities
  HEALTH: '/health'
};

// Pack Types and Costs
export const PACK_TYPES = {
  STARTER: { name: 'Starter Pack', cost: 50, cardCount: 2, description: 'Contiene 2 Cartas Comunes' },
  BOOSTER: { name: 'Booster Pack', cost: 100, cardCount: 3, description: 'Contiene 2 Cartas Comunes y 1 Rara' },
  PREMIUM: { name: 'Premium Pack', cost: 200, cardCount: 3, description: 'Contiene 2 Cartas Comunes y 1 Épica' },
  SPECIAL: { name: 'Special Pack', cost: 350, cardCount: 3, description: 'Contiene 2 Cartas Comunes y 1 Épica o Legendaria' }
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