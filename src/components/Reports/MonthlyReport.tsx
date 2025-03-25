import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { DateRangePicker } from './DateRangePicker';
import type { Transaction, Category, DateRange } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function MonthlyReport({ transactions, categories }: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: format(new Date().setDate(1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= new Date(dateRange.startDate) && 
           transactionDate <= new Date(dateRange.endDate);
  });

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const expensesByCategory = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = categories.find(c => c.id === transaction.categoryId);
      if (!category) return acc;
      
      acc[category.name] = (acc[category.name] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
    color: categories.find(c => c.name === name)?.color
  }));

  return (
    <div className="space-y-6">
      <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Receitas</h3>
          <p className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Despesas</h3>
          <p className="text-2xl font-bold text-red-600">R$ {totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Saldo</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Despesas por Categoria</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}