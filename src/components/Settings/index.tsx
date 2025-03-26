import React from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { Settings as SettingsIcon, Users, Sliders } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { AppSettings } from './AppSettings';
import type { Category } from '../../types';

type Props = {
  categories: Category[];
  budgetSettings: number[];
  onUpdateBudget: (categoryId: string, amount: number) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Settings({ categories, budgetSettings, onUpdateBudget }: Props) {
  const tabs = [
    { name: 'Configurações Gerais', icon: Sliders, component: AppSettings },
    { name: 'Usuários', icon: Users, component: UserManagement },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h2>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-xl bg-indigo-100 dark:bg-dark-800 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-dark-700 text-indigo-700 dark:text-indigo-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              <div className="flex items-center justify-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.name}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
            >
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  );
}