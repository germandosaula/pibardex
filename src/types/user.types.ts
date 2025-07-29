export interface User {
  id: string;
  username: string;
  email: string;
  coins: number;
  experience: number;
  level: number;
  selectedCharacter: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  totalGamesPlayed: number;
  totalCoinsEarned: number;
  totalCardsCollected: number;
  favoriteGame: string;
}