// src/types.ts
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
}

export interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}