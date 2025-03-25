import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../../types';

type Props = {
  transactions: Transaction[];
};

export function FinancialSummary({ transactions }: Props) {
  const calculateTotal = (type: 'income' | 'expense') => {
    return transactions
      .filter(t => t.type === type)
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  const totalIncome = calculateTotal('income');
  const totalExpenses = calculateTotal('expense');
  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Atual</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {balance.toFixed(2)}</p>
          </div>
          <DollarSign className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receita Total</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {totalIncome.toFixed(2)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Despesa Total</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">R$ {totalExpenses.toFixed(2)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
      </div>
    </div>
  );
}