import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { Reports } from './components/Reports';
import { Categories } from './components/Categories';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import type { Transaction, Category, Goal, BudgetSettings, Investment } from './types';

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

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [investments, setInvestments] = useLocalStorage<Investment[]>('investments', []);
  const [budgetSettings, setBudgetSettings] = useLocalStorage<BudgetSettings[]>('budgetSettings', []);
  const { theme, toggleTheme } = useTheme();

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === transaction.id ? transaction : t))
    );
  };

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID()
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const handleEditCategory = (category: Category) => {
    setCategories(prev =>
      prev.map(c => (c.id === category.id ? category : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const handleAddGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleEditGoal = (goal: Goal) => {
    setGoals(prev =>
      prev.map(g => (g.id === goal.id ? goal : g))
    );
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const handleUpdateBudget = (categoryId: string, amount: number) => {
    setBudgetSettings(prev => {
      const existing = prev.find(b => b.categoryId === categoryId);
      if (existing) {
        return prev.map(b => b.categoryId === categoryId ? { ...b, amount } : b);
      }
      return [...prev, { categoryId, amount }];
    });
  };

  return (
    <Router>
      <div className={`min-h-screen bg-gray-100 dark:bg-dark-900 transition-colors duration-200 ${theme}`}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                <Dashboard
                  transactions={transactions}
                  categories={categories}
                  onAddTransaction={handleAddTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              }
            />
            <Route 
              path="/goals" 
              element={
                <Goals
                  goals={goals}
                  onAddGoal={handleAddGoal}
                  onEditGoal={handleEditGoal}
                  onDeleteGoal={handleDeleteGoal}
                />
              }
            />
            <Route 
              path="/categories" 
              element={
                <Categories
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              }
            />
            <Route 
              path="/reports" 
              element={
                <Reports
                  transactions={transactions}
                  categories={categories}
                  investments={investments}
                />
              }
            />
            <Route 
              path="/settings" 
              element={
                <Settings
                  categories={categories}
                  budgetSettings={budgetSettings}
                  onUpdateBudget={handleUpdateBudget}
                />
              }
            />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;