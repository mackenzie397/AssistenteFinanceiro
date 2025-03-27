import React, { useState } from 'react';
import { Calendar, Edit, Trash, MoreVertical } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
};

export function TransactionList({ 
  transactions, 
  categories, 
  onDeleteTransaction,
  onEditTransaction 
}: Props) {
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const getCategory = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const toggleActionMenu = (id: string) => {
    if (openActionMenu === id) {
      setOpenActionMenu(null);
    } else {
      setOpenActionMenu(id);
    }
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
                  {transaction.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
              <div className="relative">
                <button
                  onClick={() => toggleActionMenu(transaction.id)}
                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                
                {openActionMenu === transaction.id && (
                  <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-1 z-10">
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
                      onClick={() => {
                        onEditTransaction(transaction);
                        setOpenActionMenu(null);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </button>
                    <button
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-700"
                      onClick={() => {
                        onDeleteTransaction(transaction.id);
                        setOpenActionMenu(null);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
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