import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import type { 
  Transaction, 
  Category, 
  Investment, 
  Goal, 
  BudgetSettings
} from '../types/index';

interface FinancialState {
  // Dados financeiros
  transactions: Transaction[];
  categories: Category[];
  investments: Investment[];
  goals: Goal[];
  budgetSettings: BudgetSettings;
  
  // Ações para transações
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Ações para categorias
  addCategory: (category: Omit<Category, 'categoryId' | 'createdAt' | 'updatedAt'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Ações para investimentos
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  updateInvestment: (id: string, investment: Partial<Investment>) => void;
  deleteInvestment: (id: string) => void;
  
  // Ações para metas
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Ações para configurações de orçamento
  updateBudgetSettings: (settings: Partial<BudgetSettings>) => void;
}

export const useFinancialStore = create<FinancialState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      transactions: [],
      categories: [],
      investments: [],
      goals: [],
      budgetSettings: {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsGoal: 0,
      },
      
      // Implementações de ações para transações
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }));
        
        toast.success('Transação adicionada com sucesso!');
      },
      
      updateTransaction: (id, transactionData) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) => 
            transaction.id === id
              ? { 
                  ...transaction, 
                  ...transactionData, 
                  updatedAt: new Date().toISOString() 
                }
              : transaction
          )
        }));
        
        toast.success('Transação atualizada com sucesso!');
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          )
        }));
        
        toast.success('Transação excluída com sucesso!');
      },
      
      // Implementações de ações para categorias
      addCategory: (categoryData) => {
        const newCategory: Category = {
          ...categoryData,
          categoryId: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory]
        }));
        
        toast.success('Categoria adicionada com sucesso!');
      },
      
      updateCategory: (id, categoryData) => {
        set((state) => ({
          categories: state.categories.map((category) => 
            category.categoryId === id
              ? { 
                  ...category, 
                  ...categoryData, 
                  updatedAt: new Date().toISOString() 
                }
              : category
          )
        }));
        
        toast.success('Categoria atualizada com sucesso!');
      },
      
      deleteCategory: (id) => {
        // Verificar se existem transações usando esta categoria
        const { transactions } = get();
        const hasTransactions = transactions.some(
          (transaction) => transaction.categoryId === id
        );
        
        if (hasTransactions) {
          toast.error('Não é possível excluir uma categoria em uso por transações.');
          return;
        }
        
        set((state) => ({
          categories: state.categories.filter(
            (category) => category.categoryId !== id
          )
        }));
        
        toast.success('Categoria excluída com sucesso!');
      },
      
      // Implementações de ações para investimentos
      addInvestment: (investmentData) => {
        const newInvestment: Investment = {
          ...investmentData,
          id: crypto.randomUUID(),
        };
        
        set((state) => ({
          investments: [...state.investments, newInvestment]
        }));
        
        toast.success('Investimento adicionado com sucesso!');
      },
      
      updateInvestment: (id, investmentData) => {
        set((state) => ({
          investments: state.investments.map((investment) => 
            investment.id === id
              ? { ...investment, ...investmentData }
              : investment
          )
        }));
        
        toast.success('Investimento atualizado com sucesso!');
      },
      
      deleteInvestment: (id) => {
        set((state) => ({
          investments: state.investments.filter(
            (investment) => investment.id !== id
          )
        }));
        
        toast.success('Investimento excluído com sucesso!');
      },
      
      // Implementações de ações para metas
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: crypto.randomUUID(),
        };
        
        set((state) => ({
          goals: [...state.goals, newGoal]
        }));
        
        toast.success('Meta adicionada com sucesso!');
      },
      
      updateGoal: (id, goalData) => {
        set((state) => ({
          goals: state.goals.map((goal) => 
            goal.id === id
              ? { ...goal, ...goalData }
              : goal
          )
        }));
        
        toast.success('Meta atualizada com sucesso!');
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id)
        }));
        
        toast.success('Meta excluída com sucesso!');
      },
      
      // Implementações de ações para configurações de orçamento
      updateBudgetSettings: (settings) => {
        set((state) => ({
          budgetSettings: { ...state.budgetSettings, ...settings }
        }));
        
        toast.success('Configurações de orçamento atualizadas com sucesso!');
      },
    }),
    {
      name: 'financial-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 