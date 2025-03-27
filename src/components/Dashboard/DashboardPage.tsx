import React from 'react';
import type { Transaction, Category, Investment } from '../../types/index';

interface DashboardPageProps {
  transactions: Transaction[];
  categories: Category[];
  investments: Investment[];
  onAddTransaction: (transaction: Transaction) => void;
  onEditTransaction: (id: string, transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      {/* TODO: Implementar dashboard com visualizações reais */}
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default DashboardPage; 