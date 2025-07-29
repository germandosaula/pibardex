import BoxedCards from '../BoxedCards'
import type { CardItem } from '../BoxedCards'
import { useUser } from '../../contexts/UserContext'

export default function StoreView() {
  const { state: { user, isAuthenticated } } = useUser();
  
  // Datos de sobres para el componente reutilizable
  const cardPacksData: CardItem[] = [
    {
      id: "EX001",
      name: "PiBardos EX",
      description: "Edición especial con cartas legendarias",
      image: "/Hero.png",
      rarity: "Legendario",
      price: "2,500 PiCoins"
    },
    {
      id: "CL002", 
      name: "PiBardos Clásico",
      description: "La colección original que inició todo",
      image: "/Hero.png",
      rarity: "Épico",
      price: "1,200 PiCoins"
    },
    {
      id: "PR003",
      name: "PiBardos Premium",
      description: "Cartas premium con efectos holográficos",
      image: "/Hero.png", 
      rarity: "Raro",
      price: "800 PiCoins"
    },
    {
      id: "ST004",
      name: "PiBardos Starter",
      description: "Pack perfecto para comenzar tu aventura",
      image: "/Hero.png",
      rarity: "Común",
      price: "300 PiCoins"
    }
  ];

  const handlePackClick = (pack: CardItem) => {
    console.log('Sobre seleccionado:', pack);
    // Aquí puedes agregar la lógica para comprar el sobre
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
        </div>

        {/* Currency Display */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-xs">PiCoins</p>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {isAuthenticated && user ? user.coins.toLocaleString() : '---'}
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
                  {isAuthenticated && user ? user.experience.toLocaleString() : '---'}
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
                  {isAuthenticated && user ? user.level : '---'}
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
    </div>
  )
}