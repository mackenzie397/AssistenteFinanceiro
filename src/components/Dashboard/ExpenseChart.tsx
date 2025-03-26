import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Scale,
  Tick
} from 'chart.js';
import { formatCurrency } from '../../utils/formatters';
import type { Transaction, Category } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  transactions: Transaction[];
  categories: Category[];
};

export function ExpenseChart({ transactions, categories }: Props) {
  const expensesByCategory = categories
    .filter(cat => cat.type === 'expense')
    .map(category => {
      const total = transactions
        .filter(t => t.categoryId === category.id && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        category,
        total
      };
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const data = {
    labels: expensesByCategory.map(item => item.category.name),
    datasets: [
      {
        label: 'Despesas',
        data: expensesByCategory.map(item => item.total),
        backgroundColor: expensesByCategory.map(item => item.category.color),
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return formatCurrency(context.raw);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(
            this: Scale<any>,
            value: number | string,
            index: number,
            ticks: Tick[]
          ): string | null {
            if (typeof value === 'number') {
              return formatCurrency(value);
            }
            return null;
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}