interface CarouselProps {
  className?: string;
}

export default function Carousel({ className = "" }: CarouselProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-900 via-orange-600 to-yellow-500 rounded-xl p-6 mb-4 relative overflow-hidden shadow-2xl ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 w-8 h-10 bg-yellow-300 rounded transform rotate-12"></div>
        <div className="absolute top-3 left-12 w-8 h-10 bg-blue-300 rounded transform -rotate-6"></div>
        <div className="absolute bottom-2 right-2 w-8 h-10 bg-orange-300 rounded transform rotate-45"></div>
        <div className="absolute bottom-3 right-12 w-8 h-10 bg-red-300 rounded transform -rotate-12"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Content Section */}
        <div className="flex-1 max-w-xl">
          
          <h1 className="text-3xl font-black mb-2 text-white drop-shadow-lg">
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              PiBardos
            </span>
          </h1>
          
          <h2 className="text-lg font-bold mb-3 text-blue-100">
            ¡Colecciona, Intercambia y Domina!
          </h2>
          
          <p className="text-blue-100 mb-4 text-sm leading-relaxed max-w-md">
            Sumérgete en el emocionante mundo de PiBardos. Abre sobres, descubre cartas legendarias 
            y construye el mazo definitivo.
          </p>

          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-6 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 text-sm">
              🎯 Jugar Ahora
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold px-6 py-2 rounded-lg border border-white/30 transition-all duration-200 text-sm">
              📦 Ver Sobres
            </button>
          </div>
        </div>

        {/* Visual Section - Enhanced Hero Image */}
        <div className="hidden lg:flex items-center justify-center flex-1 relative">
          <div className="relative group">
            {/* Glow effect background */}
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/30 via-orange-500/30 to-red-500/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Main image container */}
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <img 
                 src="/Hero.png" 
                 alt="PiBardos - Cartas y Sobres Coleccionables" 
                 className="w-72 h-auto rounded-xl shadow-2xl transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-500 ease-out"
               />
              
              {/* Shine overlay effect */}
              <div className="absolute inset-3 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Floating sparkles */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute top-4 -left-1 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
            </div>
            
            {/* Decorative elements around the image */}
            <div className="absolute -top-6 -left-6 w-12 h-12 border-2 border-yellow-400/50 rounded-full animate-spin-slow"></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-2 border-orange-400/50 rounded-full animate-pulse"></div>
            
            {/* Floating text badges */}
            <div className="absolute -top-3 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
              ¡NUEVO!
            </div>
            <div className="absolute -bottom-2 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              ÉPICO
            </div>
          </div>
        </div>
      </div>

      {/* Animated particles */}
      <div className="absolute top-4 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-8 right-1/3 w-0.5 h-0.5 bg-white rounded-full animate-ping"></div>
      <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
    </div>
  );
}