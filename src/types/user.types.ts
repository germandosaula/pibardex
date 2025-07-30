export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  experience: number;
  level: number;
  selectedCharacter: string;
  unlockedSkins: string[];
  selectedSkin: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalCoinsEarned: number;
  totalCardsCollected: number;
  favoriteGame: string;
}