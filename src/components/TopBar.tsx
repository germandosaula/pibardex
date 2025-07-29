import { useState } from 'react';
import { Search, Bell, Settings, User, Coins, LogOut } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface TopBarProps {
  className?: string;
}

export default function TopBar({ className = "" }: TopBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications] = useState(3); // Simulando notificaciones
  const { state, logout } = useUser();
  const { user, isAuthenticated, isLoading } = state;

  const handleLogout = () => {
    logout();
  };

  // Función para obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  return (
    <div className={`bg-gradient-to-r from-gray-900/95 via-red-900/80 to-gray-900/95 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl p-4 sm:p-6 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Saludo y información del usuario */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110">
              <User className="w-6 h-6 text-white" />
            </div>
            {isAuthenticated && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-32"></div>
              </div>
            ) : isAuthenticated && user ? (
              <>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {getGreeting()}, {user.username?.toUpperCase() || 'USUARIO'}!
                </h1>
                <p className="text-sm text-gray-400">Nivel {user.level || 1} • {user.experience || 0} XP</p>
              </>
            ) : (
              <>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  ¡Bienvenido a Pibardex!
                </h1>
                <p className="text-sm text-gray-400">Inicia sesión para comenzar</p>
              </>
            )}
          </div>
        </div>

        {/* Controles del lado derecho */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Barra de búsqueda */}
          <div className="relative group hidden sm:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar cartas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300 w-64"
            />
          </div>

          {/* Monedas */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl px-3 py-2 group hover:from-yellow-500/30 hover:to-orange-500/30 transition-all duration-300">
              <Coins className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
              <span className="text-yellow-400 font-bold text-sm">{(user.coins || 0).toLocaleString()}</span>
            </div>
          )}

          {/* Notificaciones */}
          <div className="relative group">
            <button className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105">
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{notifications}</span>
                </div>
              )}
            </button>
          </div>

          {/* Configuración */}
          <div className="relative group">
            <button className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:rotate-90">
              <Settings className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-all duration-300" />
            </button>
          </div>

          {/* Logout (solo si está autenticado) */}
          {isAuthenticated && (
            <div className="relative group">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 bg-gray-800/50 hover:bg-red-600/50 border border-gray-700/50 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          )}

          {/* Búsqueda móvil */}
          <div className="relative group sm:hidden">
            <button className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-red-500/50 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105">
              <Search className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}