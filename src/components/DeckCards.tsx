import { CometCard } from "./ui/comet-card";

// Tipo de datos para las cartas del deck
export interface DeckCardItem {
  id: string;
  name: string;
  level: number;
  rarity: string;
  isOwned: boolean;
  image?: string;
}

interface DeckCardsProps {
  className?: string;
  title: string;
  cards: DeckCardItem[];
  onCardClick?: (card: DeckCardItem) => void;
}

export default function DeckCards({ 
  className = "",
  title,
  cards,
  onCardClick
}: DeckCardsProps) {

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Legendario": return "from-yellow-400 to-orange-500";
      case "Épico": return "from-purple-500 to-pink-500";
      case "Raro": return "from-blue-400 to-cyan-500";
      case "Común": return "from-gray-400 to-gray-600";
      default: return "from-gray-400 to-gray-600";
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case "Legendario": return "🔥";
      case "Épico": return "💎";
      case "Raro": return "⭐";
      case "Común": return "🎯";
      default: return "🎯";
    }
  };

  const handleCardClick = (card: DeckCardItem) => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4 sm:mb-6 w-full">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            {title}
          </h3>
          <div className="text-sm text-gray-400">
            {cards.filter(card => card.isOwned).length}/{cards.length} cartas
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full justify-items-center mx-auto max-w-full">
          {cards.map((card) => (
            <CometCard key={card.id} className="group cursor-pointer w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] xl:max-w-[240px]">
              <div 
                className="flex flex-col h-full p-3 sm:p-4 w-full"
                onClick={() => handleCardClick(card)}
              >
                {/* Imagen de la carta */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg">
                  {card.isOwned ? (
                    // Carta conseguida - mostrar frente
                    <>
                      <img
                        src={card.image || "/Hero.png"}
                        alt={card.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Overlay con gradiente de rareza */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${getRarityColor(card.rarity)} opacity-20 group-hover:opacity-30 transition-opacity`} />
                      
                      {/* Badge de rareza */}
                      <div className={`absolute top-2 right-2 bg-gradient-to-r ${getRarityColor(card.rarity)} text-white px-2 py-1 rounded-full text-sm font-bold shadow-lg`}>
                        {getRarityIcon(card.rarity)}
                      </div>
                      
                      {/* Nivel cambiado por Serial Number */}
                      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-bold">
                        #{card.id}
                      </div>
                    </>
                  ) : (
                    // Carta no conseguida - mostrar reverso usando ReverseCard.png
                    <>
                      <img
                        src="/ReverseCard.png"
                        alt="Carta no conseguida"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Overlay oscuro para indicar que no está conseguida */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </>
                  )}
                  
                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </div>
  );
}