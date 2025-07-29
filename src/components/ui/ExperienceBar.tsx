import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ExperienceBarProps {
  currentExp: number;
  level: number;
  maxExp?: number;
  showLevelUp?: boolean;
}

export const ExperienceBar: React.FC<ExperienceBarProps> = ({
  currentExp,
  level,
  maxExp = level * 100, // Fórmula simple: nivel * 100
  showLevelUp = false,
}) => {
  const expForCurrentLevel = (level - 1) * 100;
  const expForNextLevel = level * 100;
  const progressExp = currentExp - expForCurrentLevel;
  const neededExp = expForNextLevel - expForCurrentLevel;
  const progressPercentage = (progressExp / neededExp) * 100;

  return (
    <div className="w-full">
      {/* Nivel y experiencia */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={20} />
          <span className="text-white font-semibold">Nivel {level}</span>
        </div>
        <span className="text-gray-300 text-sm">
          {progressExp}/{neededExp} EXP
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      {/* Animación de subida de nivel */}
      {showLevelUp && (
        <motion.div
          className="text-center mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-yellow-400 font-bold text-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            ¡NIVEL {level}!
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ExperienceBar;