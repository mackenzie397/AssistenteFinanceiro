import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

// Definir a interface do estado global
export interface AppState {
  isMenuOpen: boolean;
  notifications: Notification[];
  currentPage: string;
  // Adicione mais estados globais conforme necessário
}

// Tipos de notificações
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
  read?: boolean;
}

// Definir as ações possíveis
export type AppAction =
  | { type: 'TOGGLE_MENU' }
  | { type: 'SET_MENU'; payload: boolean }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_CURRENT_PAGE'; payload: string };

// Estado inicial
export const initialState: AppState = {
  isMenuOpen: false,
  notifications: [],
  currentPage: 'dashboard'
};

// Criar o contexto
export interface StoreContextData {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const StoreContext = createContext<StoreContextData>({
  state: initialState,
  dispatch: () => null
});

// Reducer para atualizar o estado
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
    case 'SET_MENU':
      return {
        ...state,
        isMenuOpen: action.payload
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        )
      };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload
      };
    default:
      return state;
  }
}

// Provider do contexto
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
} 