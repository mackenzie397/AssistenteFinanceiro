import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
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
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const handleAddCategory = (category: Omit<Category, 'id'>) => {
    if (editingCategory) {
      onEditCategory({ ...category, id: editingCategory.id } as Category);
      setEditingCategory(undefined);
      toast.success('Categoria atualizada com sucesso!');
    } else {
      onAddCategory(category);
      toast.success('Categoria criada com sucesso!');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (id: string) => {
    onDeleteCategory(id);
    toast.success('Categoria excluída com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerenciar Categorias
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryForm
          onAddCategory={handleAddCategory}
          editingCategory={editingCategory}
        />
        
        <div className="space-y-8">
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
      </div>
    </motion.div>
  );
}