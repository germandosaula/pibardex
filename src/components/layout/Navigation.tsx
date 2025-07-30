import React from 'react';
import { motion } from 'framer-motion';
import { Home, Gamepad2, Trophy, Package, User, Sparkles } from 'lucide-react';
import { CoinDisplay } from '../ui/CoinDisplay';
import { ExperienceBar } from '../ui/ExperienceBar';
import { useUser } from '../../contexts/UserContext';

export const Navigation: React.FC = () => {
  const { state } = useUser();
  const { user, isAuthenticated } = state;
  const coins = user?.coins || 0;
  const experience = user?.experience || 0;
  const level = user?.level || 1;
  const navItems = [
    { icon: Home, label: 'Inicio', color: 'from-blue-400 to-blue-600' },
    { icon: Gamepad2, label: 'Juegos', color: 'from-purple-400 to-purple-600' },
    { icon: Trophy, label: 'Colección', color: 'from-green-400 to-green-600' },
    { icon: Package, label: 'Tienda', color: 'from-yellow-400 to-orange-500' },
    { icon: User, label: 'Perfil', color: 'from-pink-400 to-red-500' },
  ];

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Pibardex</h1>
              <p className="text-xs text-white/60 font-medium">Trading Cards</p>
            </div>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                className="relative group px-4 py-2 rounded-xl transition-all duration-300 hover:bg-white/10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <div className="flex items-center space-x-2">
                  <motion.div
                    className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="text-white" size={16} />
                  </motion.div>
                  <span className="text-white/80 font-medium text-sm group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* User Stats - Solo mostrar si está autenticado */}
          {isAuthenticated && (
            <motion.div
              className="hidden lg:flex items-center space-x-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              {/* Coins */}
              <motion.div
                className="glass-effect-dark rounded-xl px-4 py-2 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CoinDisplay coins={coins} />
              </motion.div>

              {/* Level & Experience */}
              <motion.div
                className="glass-effect-dark rounded-xl px-4 py-2 min-w-[120px]"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/80 text-sm font-medium">Nivel</span>
                  <span className="text-yellow-400 font-bold text-lg">{level}</span>
                </div>
                <ExperienceBar 
                  currentExp={experience} 
                  level={level}
                  maxExp={level * 100}
                />
              </motion.div>

              {/* User Avatar */}
              <motion.button
                className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="text-white" size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* Guest message - Solo mostrar si no está autenticado */}
          {!isAuthenticated && (
            <motion.div
              className="hidden lg:flex items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="text-white/60 text-sm">
                Inicia sesión para ver tus estadísticas
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="md:hidden border-t border-white/10 bg-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-around py-3">
          {navItems.slice(0, 4).map((item, index) => (
            <motion.button
              key={item.label}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.9 }}
            >
              <motion.div
                className={`w-8 h-8 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}
                whileHover={{ rotate: 5 }}
              >
                <item.icon className="text-white" size={16} />
              </motion.div>
              <span className="text-white/70 text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navigation;