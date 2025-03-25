// src/context/financialReducer.ts
import { Transaction, Goal, Category } from '../types';

export type FinancialState = {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
};

type Action =
  | { type: 'INIT_DATA'; payload: Partial<FinancialState> }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'DELETE_TRANSACTION'; payload: number }
  | { type: 'DELETE_GOAL'; payload: number };

export const initialState: FinancialState = {
  transactions: [],
  goals: [],
  categories: [],
};

export const financialReducer = (
  state: FinancialState,
  action: Action
): FinancialState => {
  switch (action.type) {
    case 'INIT_DATA':
      return {
        ...state,
        ...action.payload,
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };

    case 'ADD_GOAL':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };

    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
      };

    default:
      return state;
  }
};