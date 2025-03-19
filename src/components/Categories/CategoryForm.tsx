import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import type { Category } from '../../types';

type Props = {
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  editingCategory?: Category;
};

type FormData = {
  name: string;
  color: string;
  type: 'expense' | 'income' | 'investment';
  budget?: number;
};

const defaultColors = [
  '#f87171', // red
  '#fb923c', // orange
  '#fbbf24', // amber
  '#34d399', // emerald
  '#60a5fa', // blue
  '#818cf8', // indigo
  '#a78bfa', // violet
  '#f472b6', // pink
];

export function CategoryForm({ onAddCategory, editingCategory }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: editingCategory || {
      color: defaultColors[0],
      type: 'expense'
    }
  });

  const selectedType = watch('type');

  const onSubmit = (data: FormData) => {
    onAddCategory(data);
    if (!editingCategory) {
      reset();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome
          </label>
          <input
            type="text"
            {...register('name', { required: 'Nome é obrigatório' })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo
          </label>
          <select
            {...register('type', { required: 'Tipo é obrigatório' })}
            className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
            <option value="investment">Investimento</option>
          </select>
        </div>

        {selectedType === 'expense' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Orçamento Mensal (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('budget', { min: 0 })}
              className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Cor
          </label>
          <div className="grid grid-cols-8 gap-2">
            {defaultColors.map(color => (
              <label
                key={color}
                className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                  watch('color') === color ? 'border-indigo-500' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              >
                <input
                  type="radio"
                  value={color}
                  {...register('color')}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>{editingCategory ? 'Salvar Alterações' : 'Adicionar Categoria'}</span>
        </button>
      </div>
    </form>
  );
}