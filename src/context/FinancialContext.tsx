import { createContext, useContext } from 'react';
import type { Transaction, Goal, Category } from '../types';

type FinancialContextType = {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
};

const FinancialContext = createContext<FinancialContextType>({
  transactions: [],
  goals: [],
  categories: [],
  addTransaction: () => {},
  addGoal: () => {},
});

export const useFinancial = () => useContext(FinancialContext);