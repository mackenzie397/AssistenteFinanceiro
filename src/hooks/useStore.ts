import { useContext } from 'react';
import { StoreContext, StoreContextData } from '../contexts/StoreContext';

/**
 * Hook para usar o contexto de estado global
 * @returns O contexto de estado global
 */
export function useStore(): StoreContextData {
  const context = useContext(StoreContext);
  
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  
  return context;
}

/**
 * Funções helpers para facilitar o uso
 */
export function useAppState() {
  const { state } = useStore();
  return state;
}

export function useAppDispatch() {
  const { dispatch } = useStore();
  return dispatch;
} 