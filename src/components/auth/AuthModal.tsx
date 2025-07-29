import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  
  const { login, register, state } = useUser();
  const { isLoading, error } = state;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
    setValidationErrors([]);
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    
    if (!formData.email) {
      newErrors.push('El email es requerido');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.push('El email no es válido');
    }
    
    if (!formData.password) {
      newErrors.push('La contraseña es requerida');
    } else if (formData.password.length < 6) {
      newErrors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (!isLogin) {
      // Validaciones adicionales para registro
      if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.push('La contraseña debe contener al menos una letra minúscula');
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.push('La contraseña debe contener al menos una letra mayúscula');
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.push('La contraseña debe contener al menos un número');
      }
    }
    
    if (!isLogin && !formData.username) {
      newErrors.push('El nombre de usuario es requerido');
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.push('El nombre de usuario debe tener al menos 3 caracteres');
    } else if (!isLogin && !/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.push('El nombre de usuario solo puede contener letras, números y guiones bajos');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setValidationErrors([]);
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }
      onClose();
      setFormData({ username: '', email: '', password: '' });
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Manejar errores de validación del backend
      if (error.message && error.message.includes('Validation failed')) {
        try {
          const errorData = JSON.parse(error.message.split('Validation failed')[1]);
          if (errorData.errors) {
            setValidationErrors(errorData.errors);
          }
        } catch {
          setErrors([error.message]);
        }
      } else {
        setErrors([error.message || 'Error en la autenticación']);
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors([]);
    setValidationErrors([]);
    setFormData({ username: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-red-500/20 rounded-2xl p-8 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isLogin ? (
                <LogIn className="w-8 h-8 text-white" />
              ) : (
                <UserPlus className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="text-gray-400">
              {isLogin 
                ? 'Accede a tu colección de cartas' 
                : 'Únete a la aventura de Pibardex'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username (solo para registro) */}
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50 focus:bg-gray-800/70 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>

            {/* Errors */}
            {(errors.length > 0 || validationErrors.length > 0 || error) && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                {errors.map((err, index) => (
                  <p key={index} className="text-red-400 text-sm mb-1">{err}</p>
                ))}
                {validationErrors.map((err, index) => (
                  <p key={`validation-${index}`} className="text-red-400 text-sm mb-1">{err.msg}</p>
                ))}
                {error && <p className="text-red-400 text-sm">{error}</p>}
              </div>
            )}

            {/* Password Requirements (solo para registro) */}
            {!isLogin && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-400 text-sm font-medium mb-2">Requisitos de contraseña:</p>
                <ul className="text-blue-300 text-xs space-y-1">
                  <li>• Al menos 6 caracteres</li>
                  <li>• Una letra minúscula (a-z)</li>
                  <li>• Una letra mayúscula (A-Z)</li>
                  <li>• Un número (0-9)</li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Iniciando...' : 'Registrando...'}
                </div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;