import { useState } from 'react'
import TopBar from '../TopBar'
import Carousel from '../Carousel'
import BoxedCards from '../BoxedCards'
import MemoryGame from '../games/MemoryGame'
import SpinWheel from '../SpinWheel'
import { useUser } from '../../contexts/UserContext'
import type { CardItem } from '../BoxedCards'

export default function PlayView() {
  const [currentView, setCurrentView] = useState<'main' | 'memory-game' | 'spin-wheel'>('main')
  const { addCoins, addExperience } = useUser()

  // Datos de juegos para el componente reutilizable
  const gamesData: CardItem[] = [
    {
      id: "MEMORY001",
      name: "Entrena la PiMemoria",
      description: "Encuentra las parejas de cartas coleccionables de Pibardex",
      image: "/PiMemory.png",
      rarity: "Fácil",
      category: "Memoria",
      players: "1",
      duration: "5-15 min"
    },
    {
      id: "SPIN001",
      name: "PiRuleta de la fortuna",
      description: "No se come pero puedes ganar PiCoins gratis una vez al día",
      image: "/PiRuleta.png",
      rarity: "Gratis",
      category: "Suerte",
      players: "1",
      duration: "1 Segundin"
    },
    {
      id: "GAME001",
      name: "PiBardos Battle",
      description: "Combate estratégico por turnos con tus cartas favoritas",
      image: "/Hero.png",
      rarity: "Medio",
      category: "Estrategia",
      players: "1-4",
      duration: "15-30 min"
    },
    {
      id: "GAME002",
      name: "Speed Cards",
      description: "Juego rápido de reflejos y velocidad mental",
      image: "/Hero.png",
      rarity: "Fácil",
      category: "Arcade",
      players: "1-2",
      duration: "5-10 min"
    },
    {
      id: "GAME003",
      name: "PiBardos Quest",
      description: "Aventura épica con misiones y desafíos únicos",
      image: "/Hero.png",
      rarity: "Difícil",
      category: "Aventura",
      players: "1",
      duration: "30-60 min"
    },
    {
      id: "GAME004",
      name: "Tournament Mode",
      description: "Compite contra otros jugadores en torneos oficiales",
      image: "/Hero.png",
      rarity: "Extremo",
      category: "Competitivo",
      players: "2-8",
      duration: "45-90 min"
    }
  ];

  const handleGameClick = (game: CardItem) => {
    console.log('Juego seleccionado:', game);
    
    // Navegar al juego específico
    switch (game.id) {
      case 'MEMORY001':
        setCurrentView('memory-game');
        break;
      case 'SPIN001':
        setCurrentView('spin-wheel');
        break;
      default:
        console.log('Juego no implementado aún:', game.name);
        // Aquí puedes agregar más juegos en el futuro
        break;
    }
  };

  const handleViewAllGames = () => {
    console.log('Ver todos los juegos');
    // Aquí puedes agregar la lógica para mostrar todos los juegos
  };

  const handleBackToMain = () => {
    setCurrentView('main');
  };

  const handleCoinsWon = async (coins: number) => {
    console.log(`¡Ganaste ${coins} PiCoins!`);
    try {
      await addCoins(coins);
    } catch (error) {
      console.error('Error al agregar monedas:', error);
    }
  };

  const handleExperienceGained = async (experience: number) => {
    console.log(`¡Ganaste ${experience} XP!`);
    try {
      await addExperience(experience);
    } catch (error) {
      console.error('Error al agregar experiencia:', error);
    }
  };

  // Renderizar vista según el estado actual
  if (currentView === 'memory-game') {
    return (
      <div className="w-full h-full relative">
        {/* Botón de regreso */}
        <button
          onClick={handleBackToMain}
          className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm border border-white/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <MemoryGame />
      </div>
    );
  }

  if (currentView === 'spin-wheel') {
    return (
      <div className="w-full h-full relative">
        {/* Botón de regreso */}
        <button
          onClick={handleBackToMain}
          className="absolute top-4 left-4 z-50 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm border border-white/20"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver
        </button>
        <SpinWheel onCoinsWon={handleCoinsWon} onExperienceGained={handleExperienceGained} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* TopBar */}
        <div>
          <TopBar />
        </div>

        {/* Carousel */}
        <div>
          <Carousel />
        </div>

        {/* BoxedCards para Juegos */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <BoxedCards 
            title="Modos de Juego"
            items={gamesData}
            type="games"
            gridCols="medium"
            onItemClick={handleGameClick}
            onViewAll={handleViewAllGames}
          />
          </div>
        </div>
      </div>
    </div>
  )
}