export type GameType = 'click-target' | 'runner' | 'roulette';

export interface GameSession {
  id: string;
  userId: string;
  gameType: GameType;
  score: number;
  coinsEarned: number;
  duration: number;
  startedAt: Date;
  endedAt: Date;
}

export interface ClickTargetGame {
  targets: Target[];
  score: number;
  timeLeft: number;
  isPlaying: boolean;
  coinsEarned: number;
}

export interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  createdAt: number;
  points: number;
}

export interface RunnerGame {
  player: Player;
  obstacles: Obstacle[];
  score: number;
  speed: number;
  isActive: boolean;
  distance: number;
}

export interface Player {
  x: number;
  y: number;
  isJumping: boolean;
  jumpHeight: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

export interface RouletteGame {
  segments: RouletteSegment[];
  isSpinning: boolean;
  currentRotation: number;
  result?: RouletteResult;
}

export interface RouletteSegment {
  id: string;
  label: string;
  color: string;
  probability: number;
  reward: RouletteReward;
}

export interface RouletteReward {
  type: 'coins' | 'card' | 'pack' | 'nothing';
  amount?: number;
  cardId?: string;
  packId?: string;
}

export interface RouletteResult {
  segment: RouletteSegment;
  reward: RouletteReward;
}