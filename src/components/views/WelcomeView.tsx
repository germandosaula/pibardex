import { useState } from 'react';
import { Play, Users, Trophy, Star, Sparkles, ArrowRight } from 'lucide-react';
import AuthModal from '../auth/AuthModal';

export default function WelcomeView() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const features = [
    {
      icon: <Play className="w-8 h-8" />,
      title: "Juegos Emocionantes",
      description: "Disfruta de PiMemory y PiRuleta para ganar PiCoins y cartas exclusivas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Colecciona Cartas",
      description: "Reúne cartas únicas, mejóralas y construye tu colección perfecta"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Compite y Gana",
      description: "Sube de nivel, gana experiencia y desbloquea recompensas especiales"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            {/* Logo y título principal */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img 
                  src="/PibardexRounded.png" 
                  alt="Pibardex" 
                  className="w-24 h-24 object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-orange-500/30 to-red-600/30 rounded-full blur-xl opacity-60 -z-10"></div>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-6">
              Bienvenido a Pibardex
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              La experiencia definitiva de cartas coleccionables. Juega, colecciona, mejora y compite 
              en el universo más emocionante de cartas digitales.
            </p>

            {/* CTA Principal */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
            >
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Comenzar Aventura
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-red-400 mb-4 group-hover:text-red-300 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Preview */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              ¿Qué te espera en Pibardex?
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">100+</div>
                <div className="text-gray-400">Cartas Únicas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">5</div>
                <div className="text-gray-400">Rarezas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">2</div>
                <div className="text-gray-400">Juegos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
                <div className="text-gray-400">Diversión</div>
              </div>
            </div>
          </div>

          {/* Game Preview */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* PiMemory */}
            <div className="group relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-400/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="/PiMemory.png" 
                  alt="PiMemory" 
                  className="w-16 h-16 object-contain rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">PiMemory</h3>
                  <p className="text-blue-300">Juego de Memoria</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Pon a prueba tu memoria encontrando pares de cartas. Gana PiCoins y desbloquea nuevas cartas.
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm">Hasta 100 PiCoins por partida</span>
              </div>
            </div>

            {/* PiRuleta */}
            <div className="group relative bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-2xl p-8 hover:border-red-400/50 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="/PiRuleta.png" 
                  alt="PiRuleta" 
                  className="w-16 h-16 object-contain rounded-xl"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">PiRuleta</h3>
                  <p className="text-red-300">Juego de Suerte</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                Gira la ruleta y prueba tu suerte. Gana PiCoins, cartas especiales y bonificaciones.
              </p>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm">Premios hasta 500 PiCoins</span>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-6">
              ¿Listo para comenzar tu aventura en Pibardex?
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
            >
              Crear Cuenta Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}