import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Sparkles } from 'lucide-react';
import type { Pack, Card } from '../../types/cards.types';
import CardComponent from '../cards/CardComponent';
import GameButton from '../ui/GameButton';
import CoinDisplay from '../ui/CoinDisplay';

interface PackComponentProps {
  pack: Pack;
  canAfford: boolean;
  onPurchase: (packId: string) => void;
  onOpen?: (cards: Card[]) => void;
  isPurchased?: boolean;
  isOpening?: boolean;
}

export const PackComponent: React.FC<PackComponentProps> = ({
  pack,
  canAfford,
  onPurchase,
  onOpen,
  isPurchased = false,
  isOpening = false,
}) => {
  const [showCards, setShowCards] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);

  const handlePurchase = () => {
    if (canAfford && !isPurchased) {
      onPurchase(pack.id);
    }
  };

  const handleOpen = () => {
    if (isPurchased && onOpen) {
      // Simular cartas obtenidas (esto debería venir del backend)
      const mockCards: Card[] = [
        {
          id: '1',
          name: 'Dragón de Fuego',
          description: 'Un poderoso dragón que escupe llamas',
          imageUrl: '/assets/cards/dragon.png',
          rarity: 'legendary',
          category: 'Criatura',
          power: 8,
          health: 6,
          cost: 7,
        },
        {
          id: '2',
          name: 'Guerrero Élfico',
          description: 'Un ágil guerrero de los bosques',
          imageUrl: '/assets/cards/elf-warrior.png',
          rarity: 'rare',
          category: 'Criatura',
          power: 4,
          health: 3,
          cost: 3,
        },
        {
          id: '3',
          name: 'Hechizo de Curación',
          description: 'Restaura la salud de una criatura',
          imageUrl: '/assets/cards/heal-spell.png',
          rarity: 'common',
          category: 'Hechizo',
          cost: 2,
        },
      ];
      
      setRevealedCards(mockCards);
      setShowCards(true);
      onOpen(mockCards);
    }
  };

  if (showCards) {
    return (
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              ✨
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Sobre Abierto!</h2>
            <p className="text-gray-300">Has obtenido {revealedCards.length} cartas nuevas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {revealedCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, rotateY: 180 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ delay: index * 0.3, duration: 0.6 }}
              >
                <CardComponent card={card} size="lg" />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <GameButton
              onClick={() => setShowCards(false)}
              variant="primary"
              size="lg"
            >
              ¡Genial!
            </GameButton>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Imagen del sobre */}
      <div className="relative mb-4">
        <motion.div
          className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center relative overflow-hidden"
          animate={isOpening ? { rotateY: [0, 180, 360] } : {}}
          transition={{ duration: 2 }}
        >
          <Package className="text-white" size={64} />
          
          {/* Efecto de brillo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          
          {/* Partículas flotantes */}
          <AnimatePresence>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{ 
                  x: Math.random() * 200, 
                  y: Math.random() * 200,
                  opacity: 0 
                }}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0, 1, 0] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3 
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Badge de rareza */}
        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
          {pack.cardCount} cartas
        </div>
      </div>

      {/* Información del sobre */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{pack.description}</p>
        
        {/* Distribución de rareza */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Común:</span>
            <span className="text-gray-300">{(pack.rarityDistribution.common * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-400">Rara:</span>
            <span className="text-blue-300">{(pack.rarityDistribution.rare * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Épica:</span>
            <span className="text-purple-300">{(pack.rarityDistribution.epic * 100).toFixed(0)}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-400">Legendaria:</span>
            <span className="text-yellow-300">{(pack.rarityDistribution.legendary * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      {/* Precio y botones */}
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <CoinDisplay coins={pack.price} size="md" />
        </div>

        {!isPurchased ? (
          <GameButton
            onClick={handlePurchase}
            disabled={!canAfford}
            variant={canAfford ? 'primary' : 'secondary'}
            className="w-full"
            icon={Package}
          >
            {canAfford ? 'Comprar Sobre' : 'Monedas Insuficientes'}
          </GameButton>
        ) : (
          <GameButton
            onClick={handleOpen}
            variant="success"
            className="w-full"
            icon={Sparkles}
            loading={isOpening}
          >
            {isOpening ? 'Abriendo...' : '¡Abrir Sobre!'}
          </GameButton>
        )}
      </div>
    </motion.div>
  );
};

export default PackComponent;