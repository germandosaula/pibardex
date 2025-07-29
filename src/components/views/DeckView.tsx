import { useState } from 'react';
import DeckCards from '../DeckCards';
import type { DeckCardItem } from '../DeckCards';

export default function DeckView() {
  // Datos de las 36 cartas del deck
  const deckCardsData: DeckCardItem[] = Array.from({ length: 36 }, (_, index) => {
    const cardId = (index + 1).toString().padStart(3, '0');
    const rarities = ['Común', 'Común', 'Común', 'Raro', 'Raro', 'Épico', 'Legendario'];
    const rarity = rarities[index % rarities.length];
    
    // Simulamos que algunas cartas están conseguidas (aproximadamente 60%)
    const isOwned = Math.random() > 0.4;
    
    return {
      id: cardId,
      name: `Carta ${cardId}`,
      level: Math.floor(Math.random() * 10) + 1,
      rarity,
      isOwned,
      image: "/Hero.png" // Usamos la imagen por defecto
    };
  });

  const handleCardClick = (card: DeckCardItem) => {
    console.log('Carta clickeada:', card);
    // Aquí puedes agregar lógica para mostrar detalles de la carta
  };
  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Mi Deck</h1>
          <p className="text-gray-300 text-sm">Gestiona tus cartas y mazos</p>
        </div>

      {/* Deck Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-red-800/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs">Total de Cartas</p>
              <p className="text-lg sm:text-xl font-bold text-white">247</p>
            </div>
            <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-800/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs">Mazos Activos</p>
              <p className="text-lg sm:text-xl font-bold text-white">8</p>
            </div>
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-red-800/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-red-700/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-xs">Cartas Raras</p>
              <p className="text-lg sm:text-xl font-bold text-white">23</p>
            </div>
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Deck Cards */}
      {/* Colección de Cartas */}
      <DeckCards
        title="Colección de Cartas"
        cards={deckCardsData}
        onCardClick={handleCardClick}
        className="w-full"
      />
    </div>
    </div>
  )
}