export type TransactionType = 'income' | 'expense' | 'investment';

export type UserRole = 'admin' | 'client';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: string;
  avatar?: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  budget?: number;
  type: TransactionType;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  userId: string;
};

export type Investment = {
  id: string;
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  currentValue?: number;
  earnings?: number;
  lastUpdated?: string;
  userId: string;
};

export type Goal = {
  id: string;
  date: Date;
  description: string;
  monthlyTarget: number;
  yearlyTarget: number;
  type: 'investment' | 'savings' | 'expense';
  progress: number;
  isCompleted: boolean;
  userId: string;
};

export type Theme = 'light' | 'dark' | 'system';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type BudgetSettings = {
  categoryId: string;
  amount: number;
  userId: string;
};

export type InvestmentSummary = {
  totalInvested: number;
  totalEarnings: number;
  monthlyProgress: number;
  yearlyProgress: number;
};

export type AppSettings = {
  userId: string;
  theme: Theme;
  language: string;
  currency: string;
  notifications: boolean;
  emailNotifications: boolean;
};

export type Budget = {
  id: string;
  month: number;
  year: number;
  categories: BudgetCategory[];
  userId: string;
};

export type BudgetCategory = {
  id: string;
  name: string;
  planned: number;
  actual: number;
};