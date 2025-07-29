import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';
import type { Card, CardRarity } from '../../types/cards.types';
import { RARITY_COLORS } from '../../utils/constants';

interface CardComponentProps {
  card?: Card;
  isOwned?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showRarity?: boolean;
  className?: string;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  isOwned = true,
  isFlipped = false,
  onClick,
  size = 'md',
  showRarity = true,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-40 h-56',
  };

  const rarityStars = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
  };

  if (!card) {
    // Carta vacía/placeholder
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-gray-700 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <div className="text-gray-500 text-center">
          <Lock size={24} className="mx-auto mb-2" />
          <span className="text-xs">Carta Desconocida</span>
        </div>
      </motion.div>
    );
  }

  const rarityColor = RARITY_COLORS[card.rarity];

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Parte frontal de la carta */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${rarityColor}20, ${rarityColor}40)`,
            border: `2px solid ${rarityColor}`,
            boxShadow: `0 0 20px ${rarityColor}40`,
          }}
        >
          {/* Imagen de la carta */}
          <div className="relative h-2/3 overflow-hidden">
            <img
              src={card.imageUrl || '/assets/cards/placeholder.png'}
              alt={card.name}
              className="w-full h-full object-cover"
            />
            {!isOwned && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Lock className="text-white" size={32} />
              </div>
            )}
          </div>

          {/* Información de la carta */}
          <div className="p-2 h-1/3 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-sm truncate">{card.name}</h3>
              <p className="text-gray-300 text-xs truncate">{card.description}</p>
            </div>

            {/* Rareza */}
            {showRarity && (
              <div className="flex items-center justify-between">
                <div className="flex">
                  {Array.from({ length: rarityStars[card.rarity] }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded capitalize"
                  style={{ backgroundColor: `${rarityColor}40`, color: rarityColor }}
                >
                  {card.rarity}
                </span>
              </div>
            )}
          </div>

          {/* Efecto de brillo para cartas épicas y legendarias */}
          {(card.rarity === 'epic' || card.rarity === 'legendary') && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </div>

        {/* Parte trasera de la carta */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden"
          style={{
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg, #1f2937, #374151)',
            border: '2px solid #4b5563',
          }}
        >
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">🎴</div>
              <div className="text-lg font-bold">Pibardex</div>
              <div className="text-sm opacity-75">Trading Card</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardComponent;