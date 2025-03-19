import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InvestmentOverview } from './InvestmentOverview';
import { InvestmentForm } from './InvestmentForm';
import { InvestmentList } from './InvestmentList';
import { GoalForm } from './GoalForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Investment, Category, Goal } from '../../types';

type Props = {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id'>) => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
};

export function Goals({ goals, onAddGoal, onEditGoal, onDeleteGoal }: Props) {
  const [investments, setInvestments] = useLocalStorage<Investment[]>('investments', []);
  const [categories] = useLocalStorage<Category[]>('categories', []);

  const currentGoal = goals.find(g => g.type === 'investment');

  const handleAddInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: crypto.randomUUID(),
    };
    setInvestments(prev => [newInvestment, ...prev]);
  };

  const handleEditInvestment = (investment: Investment) => {
    setInvestments(prev =>
      prev.map(inv => (inv.id === investment.id ? investment : inv))
    );
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Investment Goals
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GoalForm onAddGoal={onAddGoal} currentGoal={currentGoal} />
        
        <InvestmentOverview
          investments={investments}
          goals={goals}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InvestmentForm
          categories={categories}
          onAddInvestment={handleAddInvestment}
        />
        
        <InvestmentList
          investments={investments}
          categories={categories}
          onEditInvestment={handleEditInvestment}
          onDeleteInvestment={handleDeleteInvestment}
        />
      </div>
    </motion.div>
  );
}