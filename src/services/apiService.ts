import { API_CONFIG, API_ENDPOINTS } from '../config/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove authentication token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Authentication methods
  async register(userData: { username: string; email: string; password: string }) {
    const response = await this.post<{ token?: string; user: any }>(API_ENDPOINTS.AUTH.REGISTER, userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.post<{ token?: string; user: any }>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async getProfile() {
    return this.get(API_ENDPOINTS.AUTH.PROFILE);
  }

  async updateProfile(data: { username?: string; avatar?: string }) {
    return this.put(API_ENDPOINTS.AUTH.PROFILE, data);
  }

  // User methods
  async getUserStats() {
    return this.get(API_ENDPOINTS.USERS.STATS);
  }

  async getLeaderboard() {
    return this.get(API_ENDPOINTS.USERS.LEADERBOARD);
  }

  async addCoins(amount: number, reason: string) {
    return this.post(API_ENDPOINTS.USERS.ADD_COINS, { amount, reason });
  }

  async spendCoins(amount: number, reason: string) {
    return this.post(API_ENDPOINTS.USERS.SPEND_COINS, { amount, reason });
  }

  async addExperience(amount: number) {
    return this.post(API_ENDPOINTS.USERS.ADD_EXPERIENCE, { amount });
  }

  // Skin methods
  async buySkin(skinId: string, cost: number) {
    return this.post(API_ENDPOINTS.USERS.BUY_SKIN, { skinId, cost });
  }

  async selectSkin(skinId: string) {
    return this.post(API_ENDPOINTS.USERS.SELECT_SKIN, { skinId });
  }

  // Card methods
  async getCardCatalog() {
    return this.get(API_ENDPOINTS.CARDS.CATALOG);
  }

  async getUserCollection() {
    return this.get(API_ENDPOINTS.CARDS.COLLECTION);
  }

  async openPack(packType: string) {
    return this.post(API_ENDPOINTS.CARDS.OPEN_PACK, { packType });
  }

  async toggleCardFavorite(cardId: string) {
    return this.put(API_ENDPOINTS.CARDS.TOGGLE_FAVORITE(cardId));
  }

  async markCardsSeen(cardIds: string[]) {
    return this.put(API_ENDPOINTS.CARDS.MARK_SEEN, { cardIds });
  }

  async upgradeCard(cardId: string) {
    return this.post(API_ENDPOINTS.CARDS.UPGRADE_CARD(cardId));
  }

  // Game methods
  async startGame(gameType: string, difficulty?: string) {
    return this.post(API_ENDPOINTS.GAMES.START, { gameType, difficulty });
  }

  async completeGame(sessionId: string, gameData: any) {
    return this.put(API_ENDPOINTS.GAMES.COMPLETE(sessionId), gameData);
  }

  async getGameHistory() {
    return this.get(API_ENDPOINTS.GAMES.HISTORY);
  }

  async getGameStats() {
    return this.get(API_ENDPOINTS.GAMES.STATS);
  }

  // Admin methods
  async adminLogin(credentials: { email: string; password: string }) {
    const response = await this.post<{ token?: string; admin: any }>(API_ENDPOINTS.ADMIN.LOGIN, credentials);
    return response;
  }

  // Health check
  async healthCheck() {
    return this.get(API_ENDPOINTS.HEALTH);
  }
}

export const apiService = new ApiService();
export default apiService;