interface SidebarProps {
  className?: string;
  activeView: 'play' | 'deck' | 'store';
  onViewChange: (view: 'play' | 'deck' | 'store') => void;
}

export default function Sidebar({ className = "", activeView, onViewChange }: SidebarProps) {
  return (
    <div className={`bg-gradient-to-b from-gray-900/95 via-red-900/80 to-gray-900/95 backdrop-blur-xl border-r border-red-500/20 shadow-2xl ${className}`}>
      <div className="flex flex-col h-full items-center py-6 px-3">
        {/* Logo */}
        <div className="mb-12 relative group">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
            <img 
              src="/PibardexRounded.png" 
              alt="Pibardex Rounded" 
              className="w-full h-full object-contain group-hover:brightness-110"
            />
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-500/30 to-red-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-300 -z-10"></div>
        </div>
        
        {/* Navigation Icons mejorados */}
        <nav className="flex-1 flex flex-col items-center justify-center">
          <div className="space-y-8">
            {/* Play Icon mejorado */}
            <div className="relative group">
              <button 
                onClick={() => onViewChange('play')}
                className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform ${
                  activeView === 'play' 
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-600/30 text-green-400 scale-110 shadow-lg shadow-green-500/25' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-br hover:from-green-500/20 hover:to-emerald-600/20 hover:text-green-300 hover:scale-105'
                }`}
              >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <path 
                    d="M8 5V19L19 12L8 5Z" 
                    fill="currentColor"
                  />
                </svg>
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                Jugar
              </div>
            </div>
            

            {/* Deck Icon mejorado */}
            <div className="relative group">
              <button 
                onClick={() => onViewChange('deck')}
                className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform ${
                  activeView === 'deck' 
                    ? 'bg-gradient-to-br from-blue-500/30 to-purple-600/30 text-blue-400 scale-110 shadow-lg shadow-blue-500/25' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-600/20 hover:text-blue-300 hover:scale-105'
                }`}
              >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="transition-all duration-300"
                >
                  {/* Cartas apiladas con mejor diseño */}
                  <rect x="6" y="7" width="10" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
                  <rect x="7" y="5" width="10" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <rect x="8" y="3" width="10" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Estrella mejorada */}
                  <path d="M13 7l1 2h2l-1.5 1.5 0.5 2-2-1-2 1 0.5-2L10 9h2l1-2z" 
                        fill="currentColor" 
                        stroke="none" />
                </svg>
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                Colección
              </div>
            </div>
            
            {/* Store Icon mejorado */}
            <div className="relative group">
              <button 
                onClick={() => onViewChange('store')}
                className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 transform ${
                  activeView === 'store' 
                    ? 'bg-gradient-to-br from-orange-500/30 to-red-600/30 text-orange-400 scale-110 shadow-lg shadow-orange-500/25' 
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-red-600/20 hover:text-orange-300 hover:scale-105'
                }`}
              >
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="transition-all duration-300"
                >
                  <path 
                    d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.58 17.3 11.97L20.88 5H5.21L4.27 3H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z" 
                    fill="currentColor"
                  />
                </svg>
              </button>
              {/* Tooltip */}
              <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-gray-900/90 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                Tienda
              </div>
            </div>
          </div>
        </nav>

        {/* Footer con versión */}
        <div className="mt-auto">
          <div className="text-xs text-gray-500 text-center">
            v1.0
          </div>
        </div>
      </div>
    </div>
  );
}