import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2 } from 'lucide-react';
import { Transaction, Category } from '../../types';

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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Transações Recentes</h2>
      
      <div className="space-y-4">
        {transactions.map(transaction => {
          const category = categories.find(c => c.id === transaction.categoryId);
          
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category?.color }}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.title}</h3>
                  <p className="text-sm text-gray-500">
                    {category?.name} • {format(new Date(transaction.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                </span>
                
                <button
                  onClick={() => onEditTransaction(transaction)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
        
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">Nenhuma transação encontrada</p>
        )}
      </div>
    </div>
  );
}