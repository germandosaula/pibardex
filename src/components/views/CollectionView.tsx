import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import BoxedCards from '../BoxedCards';
import type { CardItem } from '../BoxedCards';
import { useUser } from '../../contexts/UserContext';

interface Card {
  id: string;
  cardNumber?: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  category: string;
  stats?: {
    attack: number;
    defense: number;
    health: number;
    mana: number;
  };
  abilities?: Array<{
    name: string;
    description: string;
    manaCost: number;
  }>;
  isUpgraded?: boolean;
  upgradeLevel?: number;
  power?: number;
  health?: number;
  cost?: number;
}

interface UserCard {
  cardId: Card;
  quantity: number;
  obtainedAt: string;
  isFavorite: boolean;
  isNew: boolean;
  isUpgraded?: boolean;
  upgradeLevel?: number;
  upgradedAt?: string;
}

interface CardModalProps {
  card: Card | null;
  isOwned: boolean;
  userCards: UserCard[];
  onClose: () => void;
  onUpgrade?: () => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, isOwned, userCards, onClose, onUpgrade }) => {
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  if (!card) return null;

  // Obtener la UserCard correspondiente para verificar el estado de mejora
  const userCard = userCards.find(uc => uc.cardId?.cardNumber === card.cardNumber);
  const isCardUpgraded = userCard?.isUpgraded === true;

  // Obtener la cantidad de cartas duplicadas que tiene el usuario
  const getUserCardQuantity = () => {
    return userCard ? userCard.quantity : 0;
  };

  // Obtener los requisitos de mejora según la rareza
  const getUpgradeRequirements = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 10;
      case 'rare': return 8;
      case 'epic': return 5;
      case 'legendary': return 3;
      default: return 10;
    }
  };

  const handleUpgrade = async () => {
    if (!card || !isOwned || !card.cardNumber) return;
    
    try {
      setIsUpgrading(true);
      await apiService.upgradeCard(card.cardNumber);
      
      // Mostrar mensaje de éxito
      alert('¡Carta mejorada exitosamente!');
      
      // Llamar callback para refrescar la colección
      if (onUpgrade) {
        onUpgrade();
      }
      
      onClose();
    } catch (error: any) {
      alert(error.message || 'Error al mejorar la carta');
    } finally {
      setIsUpgrading(false);
    }
  };

  const userQuantity = getUserCardQuantity();
  const upgradeRequirement = getUpgradeRequirements(card.rarity);
  const canUpgrade = userQuantity >= upgradeRequirement;

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      case 'common': return 'from-gray-400 to-gray-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityDisplayName = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'Común';
      case 'rare': return 'Raro';
      case 'epic': return 'Épico';
      case 'legendary': return 'Legendario';
      default: return rarity;
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category.toLowerCase()) {
      case 'character': return 'Personaje';
      case 'spell': return 'Hechizo';
      case 'item': return 'Objeto';
      case 'location': return 'Ubicación';
      default: return category;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-gray-800 rounded-full p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Card content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Card image */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-xl overflow-hidden max-w-md mx-auto">
                  <img
                    src={isOwned ? card.image : '/ReverseCard.png'}
                    alt={isOwned ? card.name : 'Carta no obtenida'}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay for rarity */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(card.rarity)} opacity-20`} />
                </div>
                
                {/* Card ID */}
                <div className="mt-4 text-center">
                  <span className="text-gray-400 text-lg">#{card.cardNumber || '000'}</span>
                </div>
              </div>

              {/* Card details */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {isOwned ? card.name : '???'}
                  </h2>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-base font-bold bg-gradient-to-r ${getRarityColor(card.rarity)} text-white`}>
                      {getRarityDisplayName(card.rarity)}
                    </span>
                    <span className="px-4 py-2 rounded-full text-base bg-gray-700 text-gray-300">
                      {getCategoryDisplayName(card.category)}
                    </span>
                  </div>
                </div>

                {isOwned ? (
                  <>
                    {/* Description */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Descripción</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{card.description}</p>
                    </div>

                    {/* Stats */}
                    {card.stats && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Estadísticas</h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-red-500/20 p-4 rounded-lg">
                            <span className="text-red-300 text-sm font-medium">Ataque</span>
                            <div className="text-white font-bold text-2xl">{card.stats.attack}</div>
                          </div>
                          <div className="bg-green-500/20 p-4 rounded-lg">
                            <span className="text-green-300 text-sm font-medium">Salud</span>
                            <div className="text-white font-bold text-2xl">{card.stats.health}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Abilities */}
                    {card.abilities && card.abilities.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Habilidades</h3>
                        <div className="space-y-3">
                          {card.abilities.map((ability, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-yellow-400 text-lg">{ability.name}</span>
                                <span className="text-blue-400 text-sm">{ability.manaCost} maná</span>
                              </div>
                              <p className="text-gray-300">{ability.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upgrade Section */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-3">Mejora de Carta</h3>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        {isCardUpgraded ? (
                          // Carta ya mejorada
                          <div className="text-center py-6">
                            <div className="text-6xl mb-4">⭐</div>
                            <h4 className="text-2xl font-bold text-yellow-400 mb-2">
                              ¡Esta carta ya ha sido mejorada!
                            </h4>
                            <p className="text-gray-300 text-lg">
                              Esta carta ha alcanzado su versión Holo y no puede mejorarse más.
                            </p>
                            {userCard?.upgradeLevel && (
                              <div className="mt-3">
                                <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold">
                                  Nivel de Mejora: {userCard.upgradeLevel}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Carta no mejorada - mostrar opciones de mejora
                          <>
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-300">Cartas en tu colección:</span>
                              <span className="text-white font-bold">{userQuantity}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-gray-300">Cartas necesarias para mejorar:</span>
                              <span className="text-white font-bold">{upgradeRequirement}</span>
                            </div>
                            
                            {canUpgrade ? (
                              <button
                                onClick={handleUpgrade}
                                disabled={isUpgrading}
                                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                              >
                                {isUpgrading ? 'Mejorando...' : '✨ Mejorar Carta'}
                              </button>
                            ) : (
                              <div className="text-center">
                                <p className="text-gray-400 mb-2">
                                  Necesitas {upgradeRequirement - userQuantity} cartas más para mejorar
                                </p>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min((userQuantity / upgradeRequirement) * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-8xl mb-6">🔒</div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Carta no obtenida</h3>
                    <p className="text-gray-400 text-lg">Consigue esta carta abriendo sobres o completando desafíos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CollectionView() {
  const { state: { user } } = useUser();
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh collection when user changes (e.g., after opening packs)
  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      // Si no hay usuario, limpiar las cartas del usuario pero mantener el catálogo
      setUserCards([]);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always fetch catalog (public)
      const catalogResponse = await apiService.getCardCatalog();
      if ((catalogResponse as any).cards) {
        setAllCards((catalogResponse as any).cards);
      }

      // Try to fetch user cards only if authenticated
      if (user) {
        try {
          const userCardsResponse = await apiService.getUserCollection();
          if ((userCardsResponse as any).userCards) {
            setUserCards((userCardsResponse as any).userCards);
          }
        } catch (userError) {
          // Don't set error, just continue with empty user cards
        }
      }
    } catch (error: any) {
      setError('Error al cargar la colección');
    } finally {
      setLoading(false);
    }
  };

  const isCardOwned = (cardNumber: string): boolean => {
    if (!user || !userCards) return false;
    
    return userCards.some(userCard => {
      const cardData = userCard.cardId;
      const userCardNumber = cardData?.cardNumber;
      return userCardNumber === cardNumber;
    });
  };

  // Convertir cartas a formato CardItem para BoxedCards
  const convertToCardItems = (cards: (Card & { isOwned?: boolean })[]): CardItem[] => {
    return cards.map(card => {
      const cardNumber = card.cardNumber || '000';
      const owned = card.isOwned !== undefined ? card.isOwned : isCardOwned(cardNumber);
      
      // Verificar si la carta ha sido mejorada buscando en userCards
      let isUpgraded = false;
      if (owned && user && userCards) {
        const userCard = userCards.find(uc => uc.cardId?.cardNumber === cardNumber);
        isUpgraded = userCard?.isUpgraded === true;
      }
      
      return {
        id: cardNumber, // Usar cardNumber como ID único
        name: owned ? card.name : '???',
        description: owned ? card.description : 'Carta no obtenida',
        image: owned ? card.image : '/ReverseCard.png',
        rarity: card.rarity,
        category: card.category,
        // Agregar cardNumber como propiedad adicional para mostrar
        cardNumber: cardNumber,
        // Agregar estado de propiedad
        isOwned: owned,
        // Agregar estado de mejora
        isUpgraded: isUpgraded
      };
    });
  };

  // Mostrar todas las cartas del catálogo, pero con estado de propiedad
  const getAllCardsWithOwnership = () => {
    // Si no hay cartas en el catálogo, devolver array vacío
    if (allCards.length === 0) {
      return [];
    }
    
    // Obtener cardNumbers de cartas que el usuario posee
    const ownedCardNumbers = user ? userCards.map(userCard => {
      // El backend devuelve cardId que contiene la información de la carta
      const cardData = userCard.cardId;
      const cardNumber = cardData?.cardNumber;
      return cardNumber;
    }).filter(Boolean) : []; // Filtrar valores undefined/null
    
    // Devolver todas las cartas del catálogo con información de propiedad
    const result = allCards.map(card => {
      const isOwned = ownedCardNumbers.includes(card.cardNumber);
      return {
        ...card,
        isOwned: isOwned
      };
    });
    
    // Ordenar por cardNumber de forma ascendente
    result.sort((a, b) => {
      const cardNumberA = a.cardNumber || '000';
      const cardNumberB = b.cardNumber || '000';
      return cardNumberA.localeCompare(cardNumberB, undefined, { numeric: true });
    });
    
    return result;
  };

  const handleCardClick = (cardItem: CardItem) => {
    // Encontrar la carta original usando el cardNumber
    const originalCard = allCards.find(card => card.cardNumber === cardItem.id);
    
    if (originalCard) {
      const owned = isCardOwned(originalCard.cardNumber || '000');
      
      if (owned) {
        // Buscar la UserCard correspondiente para obtener la versión correcta
        const userCard = userCards.find(uc => uc.cardId?.cardNumber === cardItem.id);
        
        // Si la carta está mejorada, usar los datos de la UserCard (que ya incluye los datos mejorados)
        // Si no está mejorada, usar la carta original
        const cardToShow = userCard?.isUpgraded ? userCard.cardId : originalCard;
        
        setSelectedCard(cardToShow);
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  if (loading) {
    return (
      <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Cargando colección...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const ownedCount = userCards.length;
  const totalCount = allCards.length;
  const isAuthenticated = !!user; // Usar el contexto de usuario

  return (
    <div className="w-full min-h-full bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            {isAuthenticated ? 'Mi Colección' : 'Catálogo de Cartas'}
          </h1>
          <p className="text-gray-300 text-sm">
            {isAuthenticated 
              ? `${ownedCount} de ${totalCount} cartas obtenidas (${totalCount > 0 ? Math.round((ownedCount / totalCount) * 100) : 0}%)`
              : `${totalCount} cartas disponibles - Inicia sesión para ver tu colección`
            }
          </p>
        </div>

        {/* Authentication notice */}
        {!isAuthenticated && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="text-blue-400 text-xl">ℹ️</div>
              <div>
                <h3 className="text-blue-300 font-semibold">Inicia sesión para desbloquear tu colección</h3>
                <p className="text-blue-200 text-sm">Haz clic en el botón de login en la barra lateral para acceder a tus cartas obtenidas</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar - only show if authenticated */}
        {isAuthenticated && (
          <div className="bg-gray-800 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (ownedCount / totalCount) * 100 : 0}%` }}
            ></div>
          </div>
        )}

        {/* Cards collection using BoxedCards */}
        {allCards.length > 0 ? (
          <BoxedCards
            title={isAuthenticated ? "Mi Colección de Cartas" : "Catálogo de Cartas"}
            items={convertToCardItems(getAllCardsWithOwnership())}
            type="store"
            gridCols="large"
            showViewAll={false}
            onItemClick={handleCardClick}
          />
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isAuthenticated ? "No tienes cartas aún" : "No hay cartas disponibles"}
            </h3>
            <p className="text-gray-400">
              {isAuthenticated 
                ? "Ve a la tienda para comprar tu primer paquete de cartas"
                : "El catálogo de cartas no está disponible en este momento"
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedCard && (
        <CardModal
          card={selectedCard}
          isOwned={isCardOwned(selectedCard.cardNumber || '000')}
          userCards={userCards}
          onClose={closeModal}
          onUpgrade={fetchData}
        />
      )}
    </div>
  );
}