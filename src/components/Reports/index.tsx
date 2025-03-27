import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import { PieChart, LineChart, FileText } from 'lucide-react';
import { MonthlyReport } from './MonthlyReport';
import { InvestmentReport } from './InvestmentReport';
import { TransactionReport } from './TransactionReport';
import { useFinancialContext } from '../../contexts/FinancialContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Reports() {
  const { transactions, categories, investments } = useFinancialContext();
  
  const tabs = [
    { name: 'Relatório Mensal', icon: PieChart, shortName: 'Mensal' },
    { name: 'Relatório de Investimentos', icon: LineChart, shortName: 'Investimentos' },
    { name: 'Relatório de Transações', icon: FileText, shortName: 'Transações' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h2>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 sm:space-x-2 rounded-xl bg-indigo-100 dark:bg-dark-800 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-medium leading-5',
                  'ring-white/60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-dark-700 text-indigo-700 dark:text-indigo-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.shortName}</span>
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4 md:mt-6">
          <Tab.Panel>
            <MonthlyReport
              transactions={transactions}
              categories={categories}
            />
          </Tab.Panel>
          <Tab.Panel>
            <InvestmentReport
              investments={investments}
              categories={categories}
            />
          </Tab.Panel>
          <Tab.Panel>
            <TransactionReport
              transactions={transactions}
              categories={categories}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </motion.div>
  );
}