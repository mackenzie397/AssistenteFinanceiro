import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tags, Plus } from 'lucide-react';
import { CategoryList } from './CategoryList';
import { CategoryForm } from './CategoryForm';
import type { Category } from '../../types';
import { toast } from 'react-hot-toast';

type Props = {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
};

export function Categories({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSubmit = (category: Omit<Category, 'id'>) => {
    if (editingCategory) {
      onEditCategory({ ...category, id: editingCategory.id });
    } else {
      onAddCategory(category);
    }
    handleCloseForm();
    toast.success('Categoria criada com sucesso!');
  };

  const handleDeleteCategory = (id: string) => {
    onDeleteCategory(id);
    toast.success('Categoria excluída com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Tags className="h-6 w-6 text-indigo-500" />
          Categorias
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-1" />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryList
          categories={categories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          type="expense"
        />
        <CategoryList
          categories={categories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          type="income"
        />
        <CategoryList
          categories={categories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          type="investment"
        />
      </div>

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={handleSubmit}
          onClose={handleCloseForm}
        />
      )}
    </motion.div>
  );
}