import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, Zap } from 'lucide-react';
import { GAME_CONFIG } from '../../../utils/constants';
import GameButton from '../../ui/GameButton';
import CoinDisplay from '../../ui/CoinDisplay';
import type { Target as TargetType, ClickTargetGame } from '../../../types/games.types';

interface ClickTargetGameProps {
  onGameEnd: (coins: number, score: number) => void;
  onBack: () => void;
}

export const ClickTargetGame: React.FC<ClickTargetGameProps> = ({ onGameEnd, onBack }) => {
  const [gameState, setGameState] = useState<ClickTargetGame>({
    isPlaying: false,
    score: 0,
    timeLeft: GAME_CONFIG.CLICK_TARGET.GAME_DURATION,
    targets: [],
    coinsEarned: 0,
  });

  const [gameStarted, setGameStarted] = useState(false);

  // Generar posición aleatoria para el objetivo
  const generateRandomPosition = useCallback(() => {
    const margin = 60; // Margen para evitar que los objetivos aparezcan en los bordes
    return {
      x: Math.random() * (window.innerWidth - margin * 2) + margin,
      y: Math.random() * (window.innerHeight - margin * 2) + margin,
    };
  }, []);

  // Crear nuevo objetivo
  const createTarget = useCallback(() => {
    const newTarget: TargetType = {
      id: Date.now() + Math.random(),
      x: 0,
      y: 0,
      size: Math.random() * (GAME_CONFIG.CLICK_TARGET.TARGET_SIZE_MAX - GAME_CONFIG.CLICK_TARGET.TARGET_SIZE_MIN) + GAME_CONFIG.CLICK_TARGET.TARGET_SIZE_MIN,
      createdAt: Date.now(),
      points: GAME_CONFIG.CLICK_TARGET.POINTS_PER_TARGET,
    };
    
    const position = generateRandomPosition();
    newTarget.x = position.x;
    newTarget.y = position.y;
    
    return newTarget;
  }, [generateRandomPosition]);

  // Manejar click en objetivo
  const handleTargetClick = useCallback((targetId: number) => {
    setGameState(prev => {
      const target = prev.targets.find(t => t.id === targetId);
      if (!target) return prev;

      const timeAlive = Date.now() - target.createdAt;
      const speedBonus = timeAlive < 1000 ? GAME_CONFIG.CLICK_TARGET.SPEED_BONUS_MULTIPLIER : 1;
      const points = Math.floor(target.points * speedBonus);

      return {
        ...prev,
        score: prev.score + points,
        targets: prev.targets.filter(t => t.id !== targetId),
      };
    });
  }, []);

  // Iniciar juego
  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameState({
      isPlaying: true,
      score: 0,
      timeLeft: GAME_CONFIG.CLICK_TARGET.GAME_DURATION,
      targets: [createTarget()],
      coinsEarned: 0,
    });
  }, [createTarget]);

  // Efecto para el temporizador del juego
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          const coins = Math.floor(prev.score / 10) * GAME_CONFIG.COINS.CLICK_TARGET_BASE;
          onGameEnd(coins, prev.score);
          return { ...prev, isPlaying: false, coinsEarned: coins };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, onGameEnd]);

  // Efecto para generar y eliminar objetivos
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const targetInterval = setInterval(() => {
      setGameState(prev => {
        let newTargets = [...prev.targets];
        
        // Eliminar objetivos expirados
        newTargets = newTargets.filter(target => 
          Date.now() - target.createdAt < GAME_CONFIG.CLICK_TARGET.TARGET_LIFETIME * 1000
        );
        
        // Agregar nuevos objetivos si es necesario
        if (newTargets.length < GAME_CONFIG.CLICK_TARGET.MAX_TARGETS && Math.random() > 0.3) {
          newTargets.push(createTarget());
        }
        
        return { ...prev, targets: newTargets };
      });
    }, 500);

    return () => clearInterval(targetInterval);
  }, [gameState.isPlaying, createTarget]);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Target className="mx-auto mb-4 text-blue-400" size={64} />
          <h1 className="text-3xl font-bold text-white mb-4">Click al Objetivo</h1>
          <p className="text-gray-300 mb-6">
            Haz click en los objetivos que aparecen en pantalla. ¡Cuanto más rápido seas, más puntos ganarás!
          </p>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">Reglas:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Duración: {GAME_CONFIG.CLICK_TARGET.GAME_DURATION} segundos</li>
                <li>• Puntos base por objetivo: {GAME_CONFIG.CLICK_TARGET.POINTS_PER_TARGET}</li>
                <li>• Bonus de velocidad: x{GAME_CONFIG.CLICK_TARGET.SPEED_BONUS_MULTIPLIER}</li>
                <li>• Los objetivos desaparecen después de {GAME_CONFIG.CLICK_TARGET.TARGET_LIFETIME} segundos</li>
              </ul>
            </div>
            <div className="flex gap-4">
              <GameButton onClick={onBack} variant="secondary" className="flex-1">
                Volver
              </GameButton>
              <GameButton onClick={startGame} variant="primary" className="flex-1" icon={Target}>
                ¡Jugar!
              </GameButton>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!gameState.isPlaying && gameState.coinsEarned > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <motion.div
          className="bg-gray-800 rounded-xl p-8 max-w-md w-full text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
          >
            🎯
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">¡Juego Terminado!</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-300 mb-2">Puntuación Final:</p>
              <p className="text-4xl font-bold text-blue-400">{gameState.score}</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4">
              <p className="text-gray-300 mb-2">Monedas Ganadas:</p>
              <CoinDisplay coins={gameState.coinsEarned} size="lg" showAnimation />
            </div>
            <div className="flex gap-4">
              <GameButton onClick={onBack} variant="secondary" className="flex-1">
                Volver
              </GameButton>
              <GameButton onClick={startGame} variant="primary" className="flex-1">
                Jugar de Nuevo
              </GameButton>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-400" size={20} />
            <span className="text-white font-semibold">{gameState.timeLeft}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            <span className="text-white font-semibold">{gameState.score}</span>
          </div>
        </div>
        <GameButton onClick={onBack} variant="secondary" size="sm">
          Salir
        </GameButton>
      </div>

      {/* Objetivos */}
      <AnimatePresence>
        {gameState.targets.map((target) => (
          <motion.button
            key={target.id}
            className="absolute bg-gradient-to-r from-red-500 to-pink-600 rounded-full border-4 border-white shadow-lg hover:scale-110 transition-transform"
            style={{
              left: target.x - target.size / 2,
              top: target.y - target.size / 2,
              width: target.size,
              height: target.size,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTargetClick(target.id)}
          >
            <Target className="text-white m-auto" size={target.size * 0.4} />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickTargetGame;