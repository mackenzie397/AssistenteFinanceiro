// src/types.ts
export type TransactionType = 'income' | 'expense' | 'investment';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string | Date;
  lastLogin?: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  budget?: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  userId?: string;
  description?: string;
}

export interface Investment {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  currentValue?: number;
  earnings?: number;
  lastUpdated?: string;
  userId?: string;
  description?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  date?: string | Date;
  description?: string;
  type?: 'investment' | 'savings' | 'expense';
  monthlyTarget?: number;
  yearlyTarget?: number;
  progress?: number;
  isCompleted?: boolean;
  userId?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface BudgetSettings {
  categoryId: string;
  amount: number;
  userId?: string;
}

export interface InvestmentSummary {
  totalInvested: number;
  totalEarnings: number;
  totalCurrentValue?: number;
  monthlyProgress?: number;
  yearlyProgress?: number;
  userId?: string;
}

export interface AppSettings {
  userId?: string;
  theme: Theme;
  language?: string;
  currency?: string;
  notifications?: boolean;
  emailNotifications?: boolean;
}

export interface Budget {
  id: string;
  month: number | string;
  year: number | string;
  categories?: BudgetCategory[];
  totalBudget?: number;
  userId?: string;
}

export interface BudgetCategory {
  id?: string;
  budgetId?: string;
  categoryId: string;
  name?: string;
  planned?: number;
  actual?: number;
  amount?: number;
}