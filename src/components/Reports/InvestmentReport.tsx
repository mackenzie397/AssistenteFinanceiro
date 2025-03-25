import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DateRangePicker } from './DateRangePicker';
import type { Investment, Category, DateRange } from '../../types';

type Props = {
  investments: Investment[];
  categories: Category[];
};

export function InvestmentReport({ investments, categories }: Props) {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    startDate: format(new Date().setDate(1), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  const filteredInvestments = investments.filter(investment => {
    const investmentDate = new Date(investment.date);
    return investmentDate >= new Date(dateRange.startDate) && 
           investmentDate <= new Date(dateRange.endDate);
  });

  const totalInvested = filteredInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = filteredInvestments.reduce((sum, inv) => sum + (inv.currentValue || inv.amount), 0);
  const totalEarnings = totalCurrentValue - totalInvested;
  const returnPercentage = ((totalEarnings / totalInvested) * 100).toFixed(2);

  const investmentsByCategory = filteredInvestments.reduce((acc, investment) => {
    const category = categories.find(c => c.id === investment.categoryId);
    if (!category) return acc;
    
    if (!acc[category.name]) {
      acc[category.name] = {
        invested: 0,
        currentValue: 0,
        earnings: 0,
      };
    }
    
    acc[category.name].invested += investment.amount;
    acc[category.name].currentValue += investment.currentValue || investment.amount;
    acc[category.name].earnings += (investment.currentValue || investment.amount) - investment.amount;
    
    return acc;
  }, {} as Record<string, { invested: number; currentValue: number; earnings: number; }>);

  const chartData = Object.entries(investmentsByCategory).map(([name, data]) => ({
    name,
    invested: data.invested,
    currentValue: data.currentValue,
    earnings: data.earnings,
    color: categories.find(c => c.name === name)?.color
  }));

  return (
    <div className="space-y-6">
      <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Total Investido</h3>
          <p className="text-2xl font-bold text-indigo-600">R$ {totalInvested.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Valor Atual</h3>
          <p className="text-2xl font-bold text-indigo-600">R$ {totalCurrentValue.toFixed(2)}</p>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Rendimento</h3>
          <p className={`text-2xl font-bold ${totalEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {totalEarnings.toFixed(2)} ({returnPercentage}%)
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Evolução por Categoria</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="invested" name="Investido" stroke="#8884d8" />
              <Line type="monotone" dataKey="currentValue" name="Valor Atual" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}