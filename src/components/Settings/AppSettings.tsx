import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Mail, Globe, DollarSign, Tag } from 'lucide-react';
import type { AppSettings as AppSettingsType, Category, BudgetSettings } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatCurrency } from '../../utils/formatters';

const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
];

const LANGUAGES = [
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'es', name: 'Español' },
];

type BudgetSettingsProps = {
  categories: Category[];
  budgetSettings: BudgetSettings[];
  onUpdateBudget: (categoryId: string, amount: number) => void;
};

export function AppSettings({ categories, budgetSettings, onUpdateBudget }: BudgetSettingsProps) {
  const [settings, setSettings] = useLocalStorage<AppSettingsType>('appSettings', {
    userId: 'default',
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
    notifications: true,
    emailNotifications: true,
  });
  
  const [editingBudgets, setEditingBudgets] = useState(false);
  const [budgetValues, setBudgetValues] = useState<Record<string, string>>({});

  // Filtrar categorias de despesas
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  // Inicializar valores de orçamento a partir dos orçamentos atuais
  React.useEffect(() => {
    const initialValues: Record<string, string> = {};
    expenseCategories.forEach(category => {
      const budget = budgetSettings.find(b => b.categoryId === category.id);
      initialValues[category.id] = budget ? String(budget.amount) : String(category.budget || 0);
    });
    setBudgetValues(initialValues);
  }, [expenseCategories, budgetSettings]);

  const handleSettingChange = (key: keyof AppSettingsType, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBudgetChange = (categoryId: string, value: string) => {
    setBudgetValues(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSaveBudgets = () => {
    // Salvar todos os orçamentos alterados
    Object.entries(budgetValues).forEach(([categoryId, value]) => {
      const amount = parseFloat(value);
      if (!isNaN(amount)) {
        onUpdateBudget(categoryId, amount);
      }
    });
    setEditingBudgets(false);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Configurações do Aplicativo
          </h3>
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Idioma
              </div>
            </label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Moeda
              </div>
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Notificações</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Notificações do Sistema
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Notificações por E-mail
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Configurações de Orçamento
            </h3>
          </div>
          {!editingBudgets ? (
            <button
              onClick={() => setEditingBudgets(true)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Editar Orçamentos
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditingBudgets(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBudgets}
                className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
              >
                Salvar
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Categoria
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Orçamento
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-gray-700">
              {expenseCategories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {editingBudgets ? (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={budgetValues[category.id] || '0'}
                        onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                        className="block w-32 ml-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-right"
                      />
                    ) : (
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatCurrency(parseFloat(budgetValues[category.id]) || 0)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}