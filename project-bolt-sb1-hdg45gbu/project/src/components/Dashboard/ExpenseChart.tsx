import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Transaction, Category } from '../../types';

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function ExpenseChart({ transactions, categories }: Props) {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      const category = categories.find(c => c.id === curr.categoryId);
      if (!category) return acc;
      
      acc[category.name] = (acc[category.name] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const data = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
    color: categories.find(c => c.name === name)?.color || '#cbd5e1'
  }));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[400px]">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Despesas por Categoria</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}