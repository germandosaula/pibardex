import { CometCard } from "./ui/comet-card";

// Tipos de datos que puede mostrar el componente
export interface CardItem {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: string;
  price?: string;
  category?: string;
  players?: string;
  duration?: string;
  difficulty?: string;
  cardNumber?: string; // Agregar cardNumber para mostrar en el footer
  isOwned?: boolean; // Agregar estado de propiedad para cartas no obtenidas
  isUpgraded?: boolean; // Agregar estado de mejora para cartas Holo
}

interface BoxedCardsProps {
  className?: string;
  title: string;
  items: CardItem[];
  type: 'store' | 'games';
  showViewAll?: boolean;
  onViewAll?: () => void;
  onItemClick?: (item: CardItem) => void;
  gridCols?: 'small' | 'medium' | 'large';
}

export default function BoxedCards({ 
  className = "",
  title,
  items,
  type,
  showViewAll = true,
  onViewAll,
  onItemClick,
  gridCols = 'medium'
}: BoxedCardsProps) {

  // Configuraciones de grid según el tamaño deseado y tipo
  const getGridClasses = () => {
    if (type === 'games') {
      // Para juegos: cards más pequeñas
      switch (gridCols) {
        case 'small':
          return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 w-full justify-items-center";
        case 'medium':
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full justify-items-center";
        case 'large':
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full justify-items-center";
        default:
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full justify-items-center";
      }
    } else {
      // Para store: sobres verticales más pequeños
      switch (gridCols) {
        case 'small':
          return "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 w-full justify-items-center";
        case 'medium':
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 w-full justify-items-center";
        case 'large':
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full justify-items-center";
        default:
          return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full justify-items-center";
      }
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary": return "from-yellow-400 to-orange-500";
      case "epic": return "from-purple-500 to-pink-500";
      case "rare": return "from-blue-400 to-cyan-500";
      case "common": return "from-gray-400 to-gray-600";
      case "fácil": return "from-green-400 to-emerald-500";
      case "medio": return "from-yellow-400 to-orange-500";
      case "difícil": return "from-red-400 to-red-600";
      case "extremo": return "from-purple-500 to-pink-500";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityIcon = (rarity: string, type: string) => {
    if (type === 'games') {
      switch (rarity.toLowerCase()) {
        case "fácil": return "🟢";
        case "medio": return "🟡";
        case "difícil": return "🔴";
        case "extremo": return "🟣";
        default: return "🎮";
      }
    } else {
      switch (rarity.toLowerCase()) {
        case "legendary": return "🔥";
        case "epic": return "💎";
        case "rare": return "⭐";
        case "common": return "🎯";
        default: return "🎯";
      }
    }
  };

  const getRarityDisplayName = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "common": return "Común";
      case "rare": return "Raro";
      case "epic": return "Épico";
      case "legendary": return "Legendario";
      case "fácil": return "Fácil";
      case "medio": return "Medio";
      case "difícil": return "Difícil";
      case "extremo": return "Extremo";
      default: return rarity;
    }
  };

  const handleItemClick = (item: CardItem) => {
    // Solo permitir clic si la carta está obtenida
    if (onItemClick && item.isOwned !== false) {
      onItemClick(item);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 sm:mb-6 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>
        
        <div className={`${getGridClasses()} mx-auto max-w-full`}>
          {items.map((item, index) => (
            <CometCard key={`${item.id}-${index}`} className={`group w-full max-w-sm ${
              item.isOwned === false ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'
            }`}>
              <div 
                className="flex flex-col h-full p-2 sm:p-3 w-full"
                onClick={() => handleItemClick(item)}
              >
                {/* Imagen con aspect ratio diferente según el tipo */}
                <div className={`relative w-full mb-4 overflow-hidden rounded-xl ${
                  type === 'store' 
                    ? 'aspect-[3/4]' // Aspecto vertical para sobres (3:4)
                    : 'aspect-[4/3]' // Aspecto horizontal para juegos (4:3)
                }`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${
                      item.isOwned === false 
                        ? 'filter grayscale' 
                        : 'group-hover:scale-110'
                    }`}
                  />
                  {/* Overlay con gradiente */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(item.rarity)} ${
                    item.isOwned === false 
                      ? 'opacity-10' 
                      : 'opacity-20 group-hover:opacity-30'
                  } transition-opacity`} />
                  
                  {/* Badge de rareza/dificultad */}
                  <div className={`absolute top-3 right-3 bg-gradient-to-r ${getRarityColor(item.rarity)} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg ${
                    item.isOwned === false ? 'opacity-50' : ''
                  }`}>
                    {getRarityIcon(item.rarity, type)} {getRarityDisplayName(item.rarity)}
                  </div>
                  
                  {/* Indicador de carta mejorada (Holo) */}
                  {item.isUpgraded && item.isOwned !== false && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ⭐ HOLO
                    </div>
                  )}
                  
                  {/* Icono de bloqueo para cartas no obtenidas */}
                  {item.isOwned === false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <div className="text-4xl">🔒</div>
                    </div>
                  )}
                  
                  {/* Efecto de brillo en hover - solo para cartas obtenidas */}
                  {item.isOwned !== false && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                </div>

                {/* Información del item */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={`font-bold mb-2 transition-colors ${
                      item.isOwned === false 
                        ? 'text-gray-400' 
                        : 'text-white group-hover:text-yellow-300'
                    }`}>
                      {item.name}
                    </h4>
                    
                    {/* Información específica según el tipo */}
                    {type === 'games' && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.players && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.isOwned === false 
                              ? 'bg-gray-500/20 text-gray-500' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            👥 {item.players}
                          </span>
                        )}
                        {item.duration && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.isOwned === false 
                              ? 'bg-gray-500/20 text-gray-500' 
                              : 'bg-green-500/20 text-green-300'
                          }`}>
                            ⏱️ {item.duration}
                          </span>
                        )}
                        {item.category && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.isOwned === false 
                              ? 'bg-gray-500/20 text-gray-500' 
                              : 'bg-purple-500/20 text-purple-300'
                          }`}>
                            🎯 {item.category}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className={`text-xs ${
                      item.isOwned === false ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      #{item.cardNumber || item.id}
                    </div>
                    {type === 'store' && item.price && (
                      <div className={`text-sm font-bold ${
                        item.isOwned === false 
                          ? 'text-gray-500' 
                          : `bg-gradient-to-r ${getRarityColor(item.rarity)} bg-clip-text text-transparent`
                      }`}>
                        {item.price}
                      </div>
                    )}
                    {type === 'games' && (
                      <div className={`text-sm font-bold ${
                        item.isOwned === false ? 'text-gray-500' : 'text-yellow-400'
                      }`}>
                        {item.isOwned === false ? '🔒 Bloqueado' : '¡Jugar!'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
}