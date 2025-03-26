import React from 'react';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function TransactionList({ transactions, categories }: Props) {
  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-3">
      {transactions.map(transaction => {
        const category = getCategory(transaction.categoryId);
        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-2 h-8 rounded"
                style={{ backgroundColor: category?.color }}
              />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {transaction.description}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={`font-medium ${
                transaction.type === 'income' 
                  ? 'text-green-600 dark:text-green-400'
                  : transaction.type === 'expense'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-blue-600 dark:text-blue-400'
              }`}>
                {transaction.type === 'expense' ? '- ' : ''}
                {formatCurrency(transaction.amount)}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {category?.name}
              </p>
            </div>
          </div>
        );
      })}

      {transactions.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          Nenhuma transação encontrada
        </p>
      )}
    </div>
  );
} 