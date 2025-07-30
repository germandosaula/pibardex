import { useState, useEffect } from 'react'
import BoxedCards from '../BoxedCards'
import type { CardItem } from '../BoxedCards'
import { useUser } from '../../contexts/UserContext'
import { apiService } from '../../services/apiService'
import { PACK_TYPES } from '../../config/api'

export default function StoreView() {
  const { state: { user, isAuthenticated }, refreshUserData } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPackAnimation, setShowPackAnimation] = useState(false);
  const [openedCards, setOpenedCards] = useState<any[]>([]);
  
  // Convertir PACK_TYPES a formato CardItem
  const cardPacksData: CardItem[] = Object.entries(PACK_TYPES).map(([key, pack]) => ({
    id: key.toLowerCase(),
    name: pack.name,
    description: pack.description,
    image: "/Hero.png",
    rarity: key === 'SPECIAL' ? 'Legendario' : 
           key === 'PREMIUM' ? 'Épico' : 
           key === 'BOOSTER' ? 'Raro' : 'Común',
    price: `${pack.cost} PiCoins`
  }));

  const handlePackClick = async (pack: CardItem) => {
    if (!isAuthenticated || !user) {
      alert('Debes iniciar sesión para comprar paquetes');
      return;
    }

    const packType = pack.id;
    const packCost = PACK_TYPES[packType.toUpperCase() as keyof typeof PACK_TYPES]?.cost;

    if (!packCost) {
      setError('Tipo de paquete no válido');
      return;
    }

    if (user.coins < packCost) {
      alert(`No tienes suficientes PiCoins. Necesitas ${packCost} PiCoins.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.openPack(packType) as any;
      
      if (response.cards) {
        // Debug: Log para ver la estructura de datos
        console.log('Cartas obtenidas:', response.cards);
        console.log('Primera carta:', response.cards[0]);
        
        // Las monedas ya se actualizaron en el backend durante openPack
        // Solo necesitamos mostrar la animación y refrescar los datos
        setOpenedCards(response.cards);
        setShowPackAnimation(true);
        
        // Refrescar el perfil del usuario para asegurar sincronización
        setTimeout(() => {
          refreshUserData();
        }, 1000);
      }
      
    } catch (error: any) {
      console.error('Error opening pack:', error);
      setError(error.message || 'Error al abrir el paquete');
    } finally {
      setLoading(false);
    }
  };

  const closePackAnimation = () => {
    setShowPackAnimation(false);
    setOpenedCards([]);
  };

  const handleViewAllPacks = () => {
    console.log('Ver todos los sobres');
    // Aquí puedes agregar la lógica para mostrar todos los sobres
  };

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Tienda</h1>
          <p className="text-gray-300 text-sm">Descubre nuevas cartas y mejoras</p>
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
          {loading && (
            <p className="text-blue-400 text-sm mt-2">Abriendo paquete...</p>
          )}
        </div>

        {/* Currency Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-xs">PiCoins</p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {isAuthenticated && user && user.coins !== undefined && user.coins !== null ? user.coins.toLocaleString() : '---'}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-3 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-300 text-xs">Experiencia</p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {isAuthenticated && user && user.experience !== undefined && user.experience !== null ? user.experience.toLocaleString() : '---'}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-3 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-300 text-xs">Nivel</p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {isAuthenticated && user && user.level !== undefined && user.level !== null ? user.level : '---'}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* BoxedCards para Sobres */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl">
            <BoxedCards 
               title="Sobres de Cartas"
               items={cardPacksData}
               type="store"
               gridCols="medium"
               onItemClick={handlePackClick}
               onViewAll={handleViewAllPacks}
             />
          </div>
        </div>
      </div>

      {/* Pack Opening Animation Modal */}
      {showPackAnimation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-red-500/30">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">¡Paquete Abierto!</h2>
              <p className="text-gray-300">Has obtenido las siguientes cartas:</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {openedCards.map((userCard, index) => {
                // Acceder correctamente a los datos de la carta
                const card = userCard.cardId || userCard;
                const cardData = {
                  name: card.name || 'Carta Desconocida',
                  description: card.description || '',
                  imageUrl: card.imageUrl || card.image,
                  rarity: card.rarity || 'common'
                };
                
                return (
                  <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                      {cardData.imageUrl ? (
                        <img 
                          src={cardData.imageUrl} 
                          alt={cardData.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-gray-500 text-4xl">🎴</div>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-center mb-1">{cardData.name}</h3>
                    <p className="text-gray-400 text-sm text-center mb-2">{cardData.description}</p>
                    <div className="flex justify-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cardData.rarity === 'legendary' ? 'bg-orange-500/20 text-orange-300' :
                        cardData.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                        cardData.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {cardData.rarity}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <button
                onClick={closePackAnimation}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}