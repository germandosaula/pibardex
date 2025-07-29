export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: CardRarity;
  category: string;
  power?: number;
  health?: number;
  cost?: number;
}

export interface UserCard {
  cardId: string;
  userId: string;
  quantity: number;
  obtainedAt: Date;
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  price: number;
  cardCount: number;
  imageUrl: string;
  rarityDistribution: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

export interface PackOpening {
  id: string;
  userId: string;
  packId: string;
  cards: Card[];
  openedAt: Date;
}

export interface Collection {
  userId: string;
  cards: UserCard[];
  totalCards: number;
  uniqueCards: number;
  completionPercentage: number;
}