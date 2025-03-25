import React from 'react';
import { Plus } from 'lucide-react';
import type { TransactionType, Category } from '../../types';

type Props = {
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
};

export function TransactionForm({ categories, onAddTransaction }: Props) {
  const [formData, setFormData] = React.useState({
    title: '',
    amount: '',
    type: 'expense' as TransactionType,
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredCategories = categories.filter(
    c => c.type === formData.type
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    onAddTransaction({
      title: formData.title,
      amount: parseFloat(formData.amount),
      type: formData.type,
      categoryId: formData.categoryId,
      date: formData.date
    });

    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Adicionar Transação</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
          <select
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as TransactionType }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
          <select
            required
            value={formData.categoryId}
            onChange={e => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Transação</span>
        </button>
      </div>
    </form>
  );
}