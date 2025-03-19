import React from 'react';
import { FinancialSummary } from './FinancialSummary';
import { ExpenseChart } from './ExpenseChart';
import { TransactionForm } from '../Transactions/TransactionForm';
import { TransactionList } from '../Transactions/TransactionList';
import type { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
};

export function Dashboard({
  transactions,
  categories,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction
}: Props) {
  return (
    <div className="space-y-8">
      <FinancialSummary transactions={transactions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ExpenseChart
          transactions={transactions}
          categories={categories}
        />
        <TransactionForm
          categories={categories}
          onAddTransaction={onAddTransaction}
        />
      </div>
      
      <TransactionList
        transactions={transactions}
        categories={categories}
        onDeleteTransaction={onDeleteTransaction}
        onEditTransaction={onEditTransaction}
      />
    </div>
  );
}