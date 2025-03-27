import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { storageService } from '../utils/storage';
import type { Transaction, Category, Goal, BudgetSettings, Investment } from '../types';
import { useAuthSelector } from '../hooks/useAuthSelector';

// Categorias padrão
const defaultCategories: Category[] = [
  { id: '1', name: 'Alimentação', color: '#f87171', budget: 800, type: 'expense' },
  { id: '2', name: 'Transporte', color: '#60a5fa', budget: 400, type: 'expense' },
  { id: '3', name: 'Lazer', color: '#34d399', budget: 300, type: 'expense' },
  { id: '4', name: 'Aluguel', color: '#a78bfa', budget: 1500, type: 'expense' },
  { id: '5', name: 'Utilidades', color: '#fbbf24', budget: 500, type: 'expense' },
  { id: '6', name: 'Compras', color: '#f472b6', budget: 400, type: 'expense' },
  { id: '7', name: 'Salário', color: '#818cf8', type: 'income' },
  { id: '8', name: 'Ações', color: '#10b981', type: 'investment' },
  { id: '9', name: 'Fundos', color: '#6366f1', type: 'investment' },
  { id: '10', name: 'Renda Fixa', color: '#8b5cf6', type: 'investment' },
];

// Prefixo para as chaves de armazenamento por usuário
const getUserStoragePrefix = (userId: string) => `user_${userId}_`;

// Interface do contexto financeiro
interface FinancialContextData {
  // Estado
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  investments: Investment[];
  budgetSettings: BudgetSettings[];
  
  // Ações para transações
  addTransaction: (newTransaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  
  // Ações para categorias
  addCategory: (category: Omit<Category, 'id'>) => void;
  editCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  
  // Ações para metas
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  editGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  
  // Ações para investimentos
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  editInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  
  // Ações para configurações de orçamento
  updateBudget: (categoryId: string, amount: number) => void;
}

// Criar o contexto
export const FinancialContext = createContext<FinancialContextData>({} as FinancialContextData);

// Provider do contexto
export function FinancialProvider({ children }: { children: ReactNode }) {
  // Obter o usuário atual do contexto de autenticação
  const user = useAuthSelector(state => state.user);
  const isAuthenticated = useAuthSelector(state => state.isAuthenticated);
  const userId = user?.id || 'guest';
  
  // Criar prefixo para chaves específicas do usuário
  const prefix = getUserStoragePrefix(userId);
  
  // Estados persistidos com useLocalStorage - específicos para cada usuário
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(`${prefix}transactions`, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(`${prefix}categories`, defaultCategories);
  const [goals, setGoals] = useLocalStorage<Goal[]>(`${prefix}goals`, []);
  const [investments, setInvestments] = useLocalStorage<Investment[]>(`${prefix}investments`, []);
  const [budgetSettings, setBudgetSettings] = useLocalStorage<BudgetSettings[]>(`${prefix}budgetSettings`, []);

  // Limpar dados do usuário anterior ao fazer logout
  useEffect(() => {
    // Limpa dados quando o usuário faz logout
    if (!isAuthenticated) {
      // Remove apenas os dados do usuário "guest", não afeta os dados dos usuários logados
      const guestPrefix = getUserStoragePrefix('guest');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(guestPrefix)) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [isAuthenticated]);

  // Gerenciamento de transações
  const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [transaction, ...prev]);
  }, [setTransactions]);

  const editTransaction = useCallback((transaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === transaction.id ? transaction : t))
    );
  }, [setTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  // Gerenciamento de categorias
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
  }, [setCategories]);

  const editCategory = useCallback((category: Category) => {
    setCategories(prev =>
      prev.map(c => (c.id === category.id ? category : c))
    );
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  }, [setCategories]);

  // Gerenciamento de metas
  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID()
    };
    setGoals(prev => [...prev, newGoal]);
  }, [setGoals]);

  const editGoal = useCallback((goal: Goal) => {
    setGoals(prev =>
      prev.map(g => (g.id === goal.id ? goal : g))
    );
  }, [setGoals]);

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [setGoals]);

  // Gerenciamento de investimentos
  const addInvestment = useCallback((investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: crypto.randomUUID()
    };
    setInvestments(prev => [...prev, newInvestment]);
  }, [setInvestments]);

  const editInvestment = useCallback((investment: Investment) => {
    setInvestments(prev =>
      prev.map(i => (i.id === investment.id ? investment : i))
    );
  }, [setInvestments]);

  const deleteInvestment = useCallback((id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  }, [setInvestments]);

  // Gerenciamento de configurações de orçamento
  const updateBudget = useCallback((categoryId: string, amount: number) => {
    setBudgetSettings(prev => {
      const existing = prev.find(b => b.categoryId === categoryId);
      if (existing) {
        return prev.map(b => b.categoryId === categoryId ? { ...b, amount } : b);
      }
      return [...prev, { categoryId, amount }];
    });
  }, [setBudgetSettings]);

  return (
    <FinancialContext.Provider
      value={{
        // Estado
        transactions,
        categories,
        goals,
        investments,
        budgetSettings,
        
        // Ações
        addTransaction,
        editTransaction,
        deleteTransaction,
        addCategory,
        editCategory,
        deleteCategory,
        addGoal,
        editGoal,
        deleteGoal,
        addInvestment,
        editInvestment,
        deleteInvestment,
        updateBudget
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

// Hook para usar o contexto
export function useFinancialContext() {
  const context = useContext(FinancialContext);
  
  if (!context) {
    throw new Error('useFinancialContext deve ser usado dentro de um FinancialProvider');
  }
  
  return context;
} 