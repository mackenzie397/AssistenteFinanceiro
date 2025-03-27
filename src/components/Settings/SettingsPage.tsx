import React from 'react';
import type { BudgetSettings } from '../../types/index';

interface SettingsPageProps {
  budgetSettings: BudgetSettings;
  onUpdateBudgetSettings: (settings: BudgetSettings) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = (props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Configurações</h1>
      {/* TODO: Implementar interface de configurações com formulários */}
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default SettingsPage; 