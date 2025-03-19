import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Target } from 'lucide-react';
import type { Goal } from '../../types';

type Props = {
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  currentGoal?: Goal;
};

type FormData = {
  monthlyTarget: number;
  yearlyTarget: number;
  description?: string;
};

export function GoalForm({ onAddGoal, currentGoal }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      monthlyTarget: currentGoal?.monthlyTarget || 0,
      yearlyTarget: currentGoal?.yearlyTarget || 0,
      description: currentGoal?.description || ''
    }
  });

  const onSubmit = (data: FormData) => {
    onAddGoal({
      title: 'Investment Goals',
      targetAmount: data.yearlyTarget,
      currentAmount: 0,
      deadline: new Date(new Date().getFullYear(), 11, 31).toISOString(),
      description: data.description,
      type: 'investment',
      monthlyTarget: data.monthlyTarget,
      yearlyTarget: data.yearlyTarget
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center gap-2 mb-6">
        <Target className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Definir Metas de Investimento
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meta Mensal (R$)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('monthlyTarget', {
              required: 'Meta mensal é obrigatória',
              min: { value: 0, message: 'O valor deve ser positivo' }
            })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.monthlyTarget && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyTarget.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Meta Anual (R$)
          </label>
          <input
            type="number"
            step="0.01"
            {...register('yearlyTarget', {
              required: 'Meta anual é obrigatória',
              min: { value: 0, message: 'O valor deve ser positivo' }
            })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.yearlyTarget && (
            <p className="mt-1 text-sm text-red-600">{errors.yearlyTarget.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descrição (opcional)
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Target className="h-4 w-4" />
          <span>Salvar Metas</span>
        </button>
      </div>
    </motion.form>
  );
}