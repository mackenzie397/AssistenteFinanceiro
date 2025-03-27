import React from 'react';
import type { Transaction, Category, Investment } from '../../types/index';

interface ReportsPageProps {
  transactions: Transaction[];
  categories: Category[];
  investments: Investment[];
}

export const ReportsPage: React.FC<ReportsPageProps> = (props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Relatórios</h1>
      {/* TODO: Implementar tela de relatórios com gráficos e análises */}
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default ReportsPage; 