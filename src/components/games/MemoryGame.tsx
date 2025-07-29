import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, Clock, Star, Volume2, VolumeX } from 'lucide-react';

// Tipos para el juego
interface GameCard {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: string;
}

interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number;
  score: number;
}

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    score: 0
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Datos de las cartas de Pibardex (simulando las 36 cartas)
  const pibardexCards = Array.from({ length: 18 }, (_, index) => {
    const cardId = (index + 1).toString().padStart(3, '0');
    const rarities = ['Común', 'Común', 'Raro', 'Raro', 'Épico', 'Legendario'];
    const rarity = rarities[index % rarities.length];
    
    return {
      id: cardId,
      name: `Pibardo ${cardId}`,
      imageUrl: `/CardMockup.png`, // Usando la imagen mockup disponible
      rarity,
      pairId: `pair-${index}`
    };
  });

  // Configuración de dificultad
  const difficultyConfig = {
    easy: { pairs: 6, gridCols: 4 },
    medium: { pairs: 12, gridCols: 6 },
    hard: { pairs: 18, gridCols: 6 }
  };

  // Función para reproducir sonidos
  const playSound = useCallback((type: 'flip' | 'match' | 'win' | 'wrong') => {
    if (!soundEnabled) return;
    
    // Simulamos sonidos con Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
      case 'flip':
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
      case 'match':
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(1600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        break;
      case 'wrong':
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [soundEnabled]);

  // Inicializar el juego
  const initializeGame = useCallback(() => {
    const config = difficultyConfig[difficulty];
    const selectedCards = pibardexCards.slice(0, config.pairs);
    
    // Crear pares de cartas
    const gameCards: GameCard[] = [];
    selectedCards.forEach(card => {
      // Primera carta del par
      gameCards.push({
        ...card,
        id: `${card.id}-1`,
        isFlipped: false,
        isMatched: false
      });
      // Segunda carta del par
      gameCards.push({
        ...card,
        id: `${card.id}-2`,
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Mezclar las cartas
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setGameStats({ moves: 0, matches: 0, timeElapsed: 0, score: 0 });
    setGameCompleted(false);
    setGameStarted(false);
  }, [difficulty]);

  // Manejar clic en carta
  const handleCardClick = (cardId: string) => {
    if (!gameStarted) setGameStarted(true);
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    playSound('flip');
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Voltear la carta
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Si se voltearon 2 cartas, verificar si coinciden
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      
      if (firstCard?.pairId === secondCard?.pairId) {
        // ¡Coincidencia!
        playSound('match');
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setGameStats(prev => ({ 
            ...prev, 
            matches: prev.matches + 1,
            score: prev.score + (100 * getRarityMultiplier(firstCard?.rarity || 'Común'))
          }));
          setFlippedCards([]);
        }, 500);
      } else {
        // No coinciden
        playSound('wrong');
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Multiplicador de puntuación por rareza
  const getRarityMultiplier = (rarity: string) => {
    switch (rarity) {
      case 'Legendario': return 4;
      case 'Épico': return 3;
      case 'Raro': return 2;
      case 'Común': return 1;
      default: return 1;
    }
  };

  // Obtener color de rareza
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendario': return 'from-yellow-400 to-orange-500';
      case 'Épico': return 'from-purple-500 to-pink-500';
      case 'Raro': return 'from-blue-400 to-cyan-500';
      case 'Común': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Timer del juego
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setGameStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Verificar si el juego está completo
  useEffect(() => {
    const totalPairs = difficultyConfig[difficulty].pairs;
    if (gameStats.matches === totalPairs && gameStarted) {
      setGameCompleted(true);
      playSound('win');
    }
  }, [gameStats.matches, difficulty, gameStarted, playSound]);

  // Inicializar al montar el componente
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header del juego */}
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 mb-6 border border-purple-500/30">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Entrena tu memoria Pibardo!
              </h1>
              <p className="text-gray-300">
                Encuentra las parejas de cartas coleccionables
              </p>
            </div>
            
            {/* Controles */}
            <div className="flex items-center gap-4">
              {/* Selector de dificultad */}
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="bg-purple-800/50 text-white px-4 py-2 rounded-lg border border-purple-500/50"
                disabled={gameStarted}
              >
                <option value="easy">Fácil (6 parejas)</option>
                <option value="medium">Medio (12 parejas)</option>
                <option value="hard">Difícil (18 parejas)</option>
              </select>
              
              {/* Control de sonido */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="bg-purple-800/50 hover:bg-purple-700/50 text-white p-2 rounded-lg border border-purple-500/50 transition-colors"
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              
              {/* Botón reiniciar */}
              <button
                onClick={initializeGame}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <RotateCcw size={20} />
                Reiniciar
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas del juego */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-800/30 backdrop-blur-sm rounded-xl p-4 border border-blue-700/30">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Tiempo</p>
                <p className="text-xl font-bold text-white">{formatTime(gameStats.timeElapsed)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-800/30 backdrop-blur-sm rounded-xl p-4 border border-green-700/30">
            <div className="flex items-center gap-3">
              <Trophy className="text-green-400" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Parejas</p>
                <p className="text-xl font-bold text-white">
                  {gameStats.matches}/{difficultyConfig[difficulty].pairs}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-800/30 backdrop-blur-sm rounded-xl p-4 border border-purple-700/30">
            <div className="flex items-center gap-3">
              <Star className="text-purple-400" size={24} />
              <div>
                <p className="text-gray-300 text-sm">Movimientos</p>
                <p className="text-xl font-bold text-white">{gameStats.moves}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-800/30 backdrop-blur-sm rounded-xl p-4 border border-yellow-700/30">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-400" size={24} />
              <div>
                <p className="text-gray-300 text-sm">PiCoins</p>
                <p className="text-xl font-bold text-white">{gameStats.score}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tablero de juego */}
        <div 
          className={`grid gap-4 mb-6`}
          style={{
            gridTemplateColumns: `repeat(${difficultyConfig[difficulty].gridCols}, minmax(0, 1fr))`
          }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="aspect-[3/4] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="relative w-full h-full preserve-3d transition-transform duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Parte trasera de la carta */}
                <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden">
                  <img
                    src="/ReverseCard.png"
                    alt="Carta volteada"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                </div>
                
                {/* Parte frontal de la carta */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden rounded-lg overflow-hidden border-2 shadow-lg"
                  style={{
                    transform: 'rotateY(180deg)',
                    borderColor: card.isMatched ? '#10b981' : 'transparent'
                  }}
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(card.rarity)} opacity-20`} />
                  
                  {/* Badge de rareza */}
                  <div className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(card.rarity)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {card.rarity}
                  </div>
                  
                  {/* Nombre de la carta */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                    <p className="text-sm font-semibold truncate">{card.name}</p>
                  </div>
                  
                  {/* Efecto de carta emparejada */}
                  {card.isMatched && (
                    <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white rounded-full p-2"
                      >
                        ✓
                      </motion.div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de victoria */}
        <AnimatePresence>
          {gameCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-8 max-w-md w-full border border-purple-500/50"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-6xl mb-4"
                  >
                    🏆
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    ¡Felicitaciones!
                  </h2>
                  <p className="text-gray-300 mb-6">
                    Has completado el Memory Game de Pibardex
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <p className="text-white">
                      <span className="text-gray-300">Tiempo:</span> {formatTime(gameStats.timeElapsed)}
                    </p>
                    <p className="text-white">
                      <span className="text-gray-300">Movimientos:</span> {gameStats.moves}
                    </p>
                    <p className="text-white">
                      <span className="text-gray-300">Puntuación:</span> {gameStats.score}
                    </p>
                  </div>
                  
                  <button
                    onClick={initializeGame}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Jugar de Nuevo
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoryGame;