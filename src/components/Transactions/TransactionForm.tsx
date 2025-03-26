import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { Transaction, Category, TransactionType } from '../../types';

type Props = {
  categories: Category[];
  onSubmit: (transaction: Partial<Transaction>) => void;
  onClose: () => void;
};

export function TransactionForm({ categories, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  // Filtra as categorias baseado no tipo selecionado
  const filteredCategories = categories.filter(cat => cat.type === selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      amount: Number(amount),
      category,
      date,
      type: selectedType
    });
    setTitle('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const transactionTypes = [
    {
      type: 'expense' as const,
      label: 'Despesa',
      icon: ArrowDownCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      type: 'income' as const,
      label: 'Receita',
      icon: ArrowUpCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      type: 'investment' as const,
      label: 'Investimento',
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
  ];

  // Reseta a categoria selecionada quando mudar o tipo
  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type);
    setCategory(''); // Limpa a categoria selecionada
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <DollarSign className="h-6 w-6 text-indigo-500" />
        Nova Transação
      </h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {transactionTypes.map(({ type, label, icon: Icon, color, bgColor }) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${
              selectedType === type
                ? `${bgColor} ${color} ring-2 ring-offset-2 ring-current`
                : 'bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-600'
            }`}
          >
            <Icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoria
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
              Nenhuma categoria encontrada. Adicione categorias na aba de Configurações.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600 dark:hover:bg-dark-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}