import { useContext } from 'react';
import { AuthContext, AuthContextData } from '../contexts/AuthContext';

/**
 * Hook para usar o contexto de autenticação
 * @returns O contexto de autenticação
 */
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
} 