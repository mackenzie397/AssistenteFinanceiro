export type TransactionType = 'income' | 'expense';

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
};

export type Theme = 'light' | 'dark';

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type BudgetSettings = {
  categoryId: string;
  amount: number;
};

export type InvestmentSummary = {
  totalInvested: number;
  totalEarnings: number;
  monthlyProgress: number;
  yearlyProgress: number;
};