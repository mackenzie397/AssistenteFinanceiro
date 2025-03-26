import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, PiggyBank, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { ExpenseChart } from './ExpenseChart';
import { TransactionList } from './TransactionList';
import { TransactionForm } from '../Transactions/TransactionForm';
import type { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
};

export function Dashboard({ 
  transactions, 
  categories,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction
}: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i,
      label: date.toLocaleString('pt-BR', { month: 'long' })
    };
  });

  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getMonth() === selectedMonth.getMonth() &&
      transactionDate.getFullYear() === selectedMonth.getFullYear()
    );
  });
  
  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const investments = filteredTransactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-indigo-500" />
          Visão Geral
        </h2>
        <div className="relative">
          <button
            onClick={() => setShowMonthSelector(!showMonthSelector)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 capitalize bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-sm"
          >
            {selectedMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {showMonthSelector && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-1 z-10">
              {months.map((month) => (
                <button
                  key={month.value}
                  onClick={() => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(month.value);
                    setSelectedMonth(newDate);
                    setShowMonthSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 dark:hover:bg-dark-700 ${
                    selectedMonth.getMonth() === month.value
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {month.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Receitas
              </p>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mt-1">
                {formatCurrency(income)}
              </h3>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Despesas
              </p>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
                {formatCurrency(expenses)}
              </h3>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Investimentos
              </p>
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formatCurrency(investments)}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Saldo
              </p>
              <h3 className={`text-xl font-bold mt-1 ${
                balance >= 0 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className={`p-3 rounded-lg ${
              balance >= 0 
                ? 'bg-indigo-100 dark:bg-indigo-900' 
                : 'bg-red-100 dark:bg-red-900'
            }`}>
              <DollarSign className={`h-6 w-6 ${
                balance >= 0 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nova Transação
          </h3>
          <TransactionForm
            categories={categories}
            onSubmit={onAddTransaction}
            onClose={() => {}}
          />
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Despesas por Categoria
          </h3>
          <div className="h-[300px]">
            <ExpenseChart transactions={filteredTransactions} categories={categories} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Últimas Transações
        </h3>
        <TransactionList 
          transactions={filteredTransactions} 
          categories={categories}
          onDeleteTransaction={onDeleteTransaction}
          onEditTransaction={onEditTransaction}
        />
      </div>
    </motion.div>
  );
}