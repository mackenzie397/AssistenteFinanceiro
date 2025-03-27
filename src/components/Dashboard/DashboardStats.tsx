import React from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import type { Transaction } from '../../types';

type Props = {
  transactions: Transaction[];
};

export function DashboardStats({ transactions }: Props) {
  const stats = transactions.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          acc.totalIncome += transaction.amount;
          break;
        case 'expense':
          acc.totalExpenses += transaction.amount;
          break;
        case 'investment':
          acc.totalInvestments += transaction.amount;
          break;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, totalInvestments: 0 }
  );

  const balance = stats.totalIncome - stats.totalExpenses - stats.totalInvestments;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white dark:bg-dark-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowUpCircle className="h-6 w-6 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Receitas
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalIncome)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ArrowDownCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Despesas
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalExpenses)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Investimentos
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalInvestments)}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                balance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {balance >= 0 ? '+' : '-'}
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Saldo
                </dt>
                <dd className="flex items-baseline">
                  <div className={`text-2xl font-semibold ${
                    balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(Math.abs(balance))}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 