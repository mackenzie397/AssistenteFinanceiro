import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import type { Investment, Category } from '../../types';

type Props = {
  categories: Category[];
  onAddInvestment: (investment: Omit<Investment, 'id'>) => void;
};

type FormData = {
  title: string;
  amount: number;
  date: string;
  categoryId: string;
  currentValue?: number;
  earnings?: number;
};

export function InvestmentForm({ categories, onAddInvestment }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  const investmentCategories = categories.filter(cat => cat.type === 'investment');

  const onSubmit = (data: FormData) => {
    onAddInvestment({
      ...data,
      amount: Number(data.amount),
      currentValue: data.currentValue ? Number(data.currentValue) : undefined,
      earnings: data.currentValue ? Number(data.currentValue) - Number(data.amount) : undefined,
      lastUpdated: new Date().toISOString()
    });
    reset();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Adicionar Investimento
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Título
          </label>
          <input
            type="text"
            {...register('title', { required: 'Título é obrigatório' })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Valor Investido
          </label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { 
              required: 'Valor é obrigatório',
              min: { value: 0.01, message: 'Valor deve ser maior que zero' }
            })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Valor Atual (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('currentValue', { min: 0 })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Categoria
          </label>
          <select
            {...register('categoryId', { required: 'Categoria é obrigatória' })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Selecione uma categoria</option>
            {investmentCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Data
          </label>
          <input
            type="date"
            {...register('date', { required: 'Data é obrigatória' })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>Adicionar Investimento</span>
        </button>
      </div>
    </motion.form>
  );
}