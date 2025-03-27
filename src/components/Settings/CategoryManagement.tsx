import React, { useState, useCallback } from 'react';
import { Tag, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Category, TransactionType } from '../../types';
import { useFinancialContext } from '../../contexts/FinancialContext';
import { toast } from 'react-hot-toast';

// Componente para o formulário de categoria
interface CategoryFormProps {
  onSubmit: (category: Omit<Category, 'id'>) => void;
  onCancel: () => void;
  initialData?: Category;
}

function CategoryForm({ onSubmit, onCancel, initialData }: CategoryFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<TransactionType>(initialData?.type || 'expense');
  const [color, setColor] = useState(initialData?.color || '#3b82f6');
  const [budget, setBudget] = useState<number | undefined>(initialData?.budget);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('O nome da categoria é obrigatório');
      return;
    }

    onSubmit({
      name: name.trim(),
      type,
      color,
      budget: type === 'expense' ? budget : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {initialData ? 'Editar Categoria' : 'Nova Categoria'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              placeholder="Nome da categoria"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="investment">Investimento</option>
            </select>
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Orçamento (opcional)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={budget || ''}
                onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="Valor do orçamento"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cor
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-10 border-0 p-0 cursor-pointer"
              />
              <span 
                className="px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: color }}
              >
                Exemplo
              </span>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {initialData ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Componente para representar uma linha na tabela de categorias
interface CategoryRowProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, onEdit, onDelete }) => {
  return (
    <tr key={category.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div
            className="h-8 w-8 rounded-full mr-3"
            style={{ backgroundColor: category.color }}
          />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {category.name}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          category.type === 'expense'
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            : category.type === 'income'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
        }`}>
          {category.type === 'expense' 
            ? 'Despesa' 
            : category.type === 'income' 
            ? 'Receita' 
            : 'Investimento'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {category.budget 
          ? new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(category.budget)
          : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onEdit(category)}
            className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
            title="Editar"
            aria-label="Editar categoria"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
            title="Excluir"
            aria-label="Excluir categoria"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Componente principal para gerenciamento de categorias
export function CategoryManagement() {
  const { categories, addCategory, editCategory, deleteCategory } = useFinancialContext();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleAddCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    addCategory(categoryData);
    setShowForm(false);
    toast.success('Categoria criada com sucesso!');
  }, [addCategory]);

  const handleUpdateCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    
    editCategory({
      ...editingCategory,
      ...categoryData
    });
    
    setEditingCategory(null);
    toast.success('Categoria atualizada com sucesso!');
  }, [editingCategory, editCategory]);

  const handleDeleteCategory = useCallback((id: string) => {
    // Verificar se a categoria é usada em transações antes de excluir
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar transações existentes.')) {
      deleteCategory(id);
      toast.success('Categoria excluída com sucesso!');
    }
  }, [deleteCategory]);

  const handleEditClick = useCallback((category: Category) => {
    setEditingCategory(category);
  }, []);

  // Organizar categorias por tipo para melhor visualização
  const categoriesByType = {
    expense: categories.filter(c => c.type === 'expense'),
    income: categories.filter(c => c.type === 'income'),
    investment: categories.filter(c => c.type === 'investment')
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Gerenciamento de Categorias
          </h3>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          aria-label="Adicionar nova categoria"
        >
          <Plus className="w-4 h-4" />
          Nova Categoria
        </button>
      </div>

      {/* Seção de despesas */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Despesas
        </h4>
        <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orçamento Padrão
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoriesByType.expense.length > 0 ? (
                categoriesByType.expense.map(category => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCategory}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma categoria de despesa cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de receitas */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Receitas
        </h4>
        <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orçamento Padrão
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoriesByType.income.length > 0 ? (
                categoriesByType.income.map(category => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCategory}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma categoria de receita cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção de investimentos */}
      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
          Investimentos
        </h4>
        <div className="overflow-x-auto bg-white dark:bg-dark-800 rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Orçamento Padrão
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoriesByType.investment.length > 0 ? (
                categoriesByType.investment.map(category => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteCategory}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma categoria de investimento cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar/editar categoria */}
      {(showForm || editingCategory) && (
        <CategoryForm
          initialData={editingCategory || undefined}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
} 