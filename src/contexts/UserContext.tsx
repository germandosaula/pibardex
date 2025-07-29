import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { apiService } from '../services/apiService';
import type { User } from '../types/user.types';

// Tipos para el estado del usuario
interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

// Tipos para las acciones
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'UPDATE_EXPERIENCE'; payload: number }
  | { type: 'UPDATE_LEVEL'; payload: number }
  | { type: 'LOGOUT' };

// Estado inicial
const initialState: UserState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

// Reducer para manejar las acciones
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'UPDATE_COINS':
      return {
        ...state,
        user: state.user ? { ...state.user, coins: action.payload } : null,
      };
    
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        user: state.user ? { ...state.user, experience: action.payload } : null,
      };
    
    case 'UPDATE_LEVEL':
      return {
        ...state,
        user: state.user ? { ...state.user, level: action.payload } : null,
      };
    
    case 'LOGOUT':
      return { ...initialState };
    
    default:
      return state;
  }
};

// Contexto
interface UserContextType {
  state: UserState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  updateCoins: (amount: number) => void;
  addCoins: (amount: number) => Promise<void>;
  spendCoins: (amount: number) => Promise<boolean>;
  addExperience: (amount: number) => Promise<void>;
  canAfford: (amount: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Función para cargar datos del usuario desde el backend
  const refreshUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Verificar si hay token almacenado
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_USER', payload: null });
        return;
      }

      // Configurar token en el servicio API
      apiService.setToken(token);
      
      // Obtener datos del usuario
      const userData = await apiService.getUserStats() as User;
      dispatch({ type: 'SET_USER', payload: userData });
    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar datos del usuario' });
      // Si hay error, limpiar token inválido
      localStorage.removeItem('token');
      apiService.removeToken();
    }
  };

  // Función de login
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.login({ email, password });
      
      if (response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
      } else {
        // Si no viene el usuario en la respuesta, obtenerlo por separado
        await refreshUserData();
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al iniciar sesión' });
      throw error;
    }
  };

  // Función de registro
  const register = async (userData: { username: string; email: string; password: string }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await apiService.register(userData);
      
      if (response.user) {
        dispatch({ type: 'SET_USER', payload: response.user });
      } else {
        // Si no viene el usuario en la respuesta, obtenerlo por separado
        await refreshUserData();
      }
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Error al registrarse' });
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    apiService.removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  // Función para actualizar monedas localmente
  const updateCoins = (amount: number) => {
    dispatch({ type: 'UPDATE_COINS', payload: amount });
  };

  // Función para añadir monedas (sincronizada con backend)
  const addCoins = async (amount: number) => {
    try {
      if (!state.user) return;
      
      // Actualizar en el backend
      await apiService.post('/users/coins/add', { amount });
      
      // Actualizar localmente
      const newAmount = state.user.coins + amount;
      dispatch({ type: 'UPDATE_COINS', payload: newAmount });
    } catch (error) {
      console.error('Error adding coins:', error);
      // Recargar datos del usuario en caso de error
      await refreshUserData();
    }
  };

  // Función para gastar monedas
  const spendCoins = async (amount: number): Promise<boolean> => {
    try {
      if (!state.user || state.user.coins < amount) {
        return false;
      }
      
      // Actualizar en el backend
      await apiService.post('/users/coins/spend', { amount });
      
      // Actualizar localmente
      const newAmount = state.user.coins - amount;
      dispatch({ type: 'UPDATE_COINS', payload: newAmount });
      
      return true;
    } catch (error) {
      console.error('Error spending coins:', error);
      // Recargar datos del usuario en caso de error
      await refreshUserData();
      return false;
    }
  };

  // Función para añadir experiencia
  const addExperience = async (amount: number) => {
    console.log(`🎯 addExperience ejecutándose con ${amount} XP`);
    try {
      if (!state.user) {
        console.log('❌ No hay usuario autenticado');
        return;
      }

      console.log(`📊 Estado actual del usuario:`, {
        username: state.user.username,
        level: state.user.level,
        experience: state.user.experience,
        coins: state.user.coins
      });
      
      // Calcular nuevo nivel con la nueva fórmula
      const calculateLevelFromExperience = (exp: number) => {
        let level = 1;
        let totalExpNeeded = 0;
        let expForCurrentLevel = 100; // Primer nivel requiere 100 XP
        
        while (totalExpNeeded + expForCurrentLevel <= exp) {
          totalExpNeeded += expForCurrentLevel;
          level++;
          expForCurrentLevel = Math.floor(expForCurrentLevel * 1.1); // Incremento del 10%
        }
        
        return level;
      };
      
      const newExp = state.user.experience + amount;
      const newLevel = calculateLevelFromExperience(newExp);
      
      console.log(`🧮 Cálculos locales:`, {
        experienciaActual: state.user.experience,
        experienciaAAñadir: amount,
        nuevaExperiencia: newExp,
        nivelActual: state.user.level,
        nuevoNivel: newLevel
      });
      
      // Llamar al backend para actualizar la experiencia
      console.log(`🌐 Enviando petición al backend...`);
      const response = await apiService.addExperience(amount) as any;
      
      console.log(`📡 Respuesta del backend:`, response);
      
      if (response.success) {
        console.log(`✅ Backend respondió exitosamente`);
        console.log(`📈 Datos del backend:`, {
          experiencia: response.data.experience,
          nivel: response.data.level
        });
        
        // Actualizar el estado local con los nuevos valores
        dispatch({ type: 'UPDATE_EXPERIENCE', payload: response.data.experience });
        dispatch({ type: 'UPDATE_LEVEL', payload: response.data.level });
        
        console.log(`🔄 Estado local actualizado`);
      } else {
        console.log(`❌ Backend respondió con error:`, response);
      }
    } catch (error) {
      console.error('💥 Error al añadir experiencia:', error);
      // Recargar datos del usuario en caso de error
      await refreshUserData();
    }
  };

  // Función para verificar si puede permitirse algo
  const canAfford = (amount: number): boolean => {
    return state.user ? state.user.coins >= amount : false;
  };

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    refreshUserData();
  }, []);

  const contextValue: UserContextType = {
    state,
    login,
    register,
    logout,
    refreshUserData,
    updateCoins,
    addCoins,
    spendCoins,
    addExperience,
    canAfford,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;