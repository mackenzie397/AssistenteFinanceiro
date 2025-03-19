import React from 'react';
import type { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function Reports({ transactions, categories }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Relatórios</h2>
      {/* Placeholder - Will be implemented in the next step */}
    </div>
  );
}