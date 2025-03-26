export type TransactionType = 'income' | 'expense';

export type UserRole = 'admin' | 'client';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
};

export type Category = {
  id: string;
  name: string;
  color: string;
  budget?: number;
  type: 'expense' | 'income' | 'investment';
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
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
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
  type: 'savings' | 'investment';
  monthlyTarget?: number;
  yearlyTarget?: number;
  userId: string;
};

export type Theme = 'light' | 'dark';

export type DateRange = {
  startDate: string;
  endDate: string;
};

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