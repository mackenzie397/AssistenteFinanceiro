// src/types.ts
export type TransactionType = 'income' | 'expense' | 'investment';

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
  type: 'income' | 'expense';
  categoryId: string;
  date: string;
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
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  type?: 'investment';
  monthlyTarget?: number;
  yearlyTarget?: number;
}