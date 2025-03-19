import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import type { Investment, Goal } from '../../types';

type Props = {
  investments: Investment[];
  goals: Goal[];
};

export function InvestmentOverview({ investments, goals }: Props) {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarnings = investments.reduce((sum, inv) => sum + (inv.earnings || 0), 0);
  
  const investmentGoal = goals.find(g => g.type === 'investment');
  const monthlyTarget = Number(investmentGoal?.monthlyTarget) || 0;
  const yearlyTarget = Number(investmentGoal?.yearlyTarget) || 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyInvestments = investments.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
  }).reduce((sum, inv) => sum + inv.amount, 0);

  const yearlyInvestments = investments.filter(inv => {
    const invDate = new Date(inv.date);
    return invDate.getFullYear() === currentYear;
  }).reduce((sum, inv) => sum + inv.amount, 0);

  const monthlyProgress = monthlyTarget > 0 ? (monthlyInvestments / monthlyTarget) * 100 : 0;
  const yearlyProgress = yearlyTarget > 0 ? (yearlyInvestments / yearlyTarget) * 100 : 0;

  const formatCurrency = (value: number | undefined | null) => {
    const numValue = Number(value) || 0;
    return `R$ ${numValue.toFixed(2)}`;
  };

  const cards = [
    {
      title: 'Meta Mensal',
      value: formatCurrency(monthlyTarget),
      progress: monthlyProgress,
      icon: Calendar,
      color: 'text-blue-600',
      invested: formatCurrency(monthlyInvestments),
    },
    {
      title: 'Meta Anual',
      value: formatCurrency(yearlyTarget),
      progress: yearlyProgress,
      icon: Target,
      color: 'text-purple-600',
      invested: formatCurrency(yearlyInvestments),
    },
    {
      title: 'Total Investido',
      value: formatCurrency(totalInvested),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Rendimentos',
      value: formatCurrency(totalEarnings),
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {card.title}
            </h3>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {card.value}
          </p>
          
          {card.progress !== undefined && (
            <>
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5 mb-2">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Investido: {card.invested} ({card.progress.toFixed(1)}%)
              </p>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}