import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../types';

/**
 * Hook para selecionar partes específicas do estado do AuthContext
 * Ajuda a evitar renderizações desnecessárias quando apenas parte do contexto muda
 * 
 * @param selector Função seletora que extrai valores do contexto
 * @returns O resultado da função seletora
 */
export function useAuthSelector<T>(selector: (context: {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}) => T): T {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuthSelector deve ser usado dentro de um AuthProvider');
  }
  
  return selector(context);
} 