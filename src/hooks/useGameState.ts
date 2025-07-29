import { useState, useCallback } from 'react';
import type { User } from '../types/user.types';

interface GameState {
  user: User | null;
  coins: number;
  experience: number;
  level: number;
  isLoading: boolean;
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    coins: 1250, // Valor inicial para demo
    experience: 1150, // Valor inicial para demo
    level: 12, // Valor inicial para demo
    isLoading: false,
  });

  const addCoins = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  const spendCoins = useCallback((amount: number) => {
    setGameState(prev => {
      if (prev.coins >= amount) {
        return {
          ...prev,
          coins: prev.coins - amount,
        };
      }
      return prev;
    });
  }, []);

  const addExperience = useCallback((amount: number) => {
    setGameState(prev => {
      const newExp = prev.experience + amount;
      const newLevel = Math.floor(newExp / 100) + 1; // Fórmula simple: cada 100 exp = 1 nivel
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
      };
    });
  }, []);

  const canAfford = useCallback((amount: number) => {
    return gameState.coins >= amount;
  }, [gameState.coins]);

  const setUser = useCallback((user: User | null) => {
    setGameState(prev => ({
      ...prev,
      user,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setGameState(prev => ({
      ...prev,
      isLoading: loading,
    }));
  }, []);

  return {
    gameState,
    addCoins,
    spendCoins,
    addExperience,
    canAfford,
    setUser,
    setLoading,
  };
};

export default useGameState;