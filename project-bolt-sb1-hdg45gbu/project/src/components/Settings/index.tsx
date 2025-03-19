import React from 'react';
import type { Category, BudgetSettings } from '../../types';

type Props = {
  categories: Category[];
  budgetSettings: BudgetSettings[];
  onUpdateBudget: (categoryId: string, amount: number) => void;
};

export function Settings({ categories, budgetSettings, onUpdateBudget }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Configurações</h2>
      {/* Placeholder - Will be implemented in the next step */}
    </div>
  );
}