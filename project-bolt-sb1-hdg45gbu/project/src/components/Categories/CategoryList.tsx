import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, DollarSign } from 'lucide-react';
import type { Category } from '../../types';

type Props = {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  type: 'expense' | 'income' | 'investment';
};

export function CategoryList({
  categories,
  onEditCategory,
  onDeleteCategory,
  type
}: Props) {
  const filteredCategories = categories.filter(category => category.type === type);

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {type === 'expense' && 'Categorias de Despesas'}
        {type === 'income' && 'Categorias de Receitas'}
        {type === 'investment' && 'Categorias de Investimentos'}
      </h3>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredCategories.map(category => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </h4>
                  {category.budget && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Orçamento: R$ {category.budget.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Editar"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                  title="Excluir"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCategories.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhuma categoria encontrada
          </p>
        )}
      </div>
    </div>
  );
}