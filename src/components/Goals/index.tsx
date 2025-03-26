import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, DollarSign, ChevronDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { GoalProgress } from './GoalProgress';
import type { Goal } from '../../types';
import { MonthSelector } from '../Common/MonthSelector';
import { toast } from 'react-hot-toast';

export function Goals() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [yearlyGoal, setYearlyGoal] = useState('');
  const [description, setDescription] = useState('');
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      const parsedGoals = JSON.parse(savedGoals).map((goal: any) => ({
        ...goal,
        date: new Date(goal.date)
      }));
      setGoals(parsedGoals);
    }
  }, []);

  // Filtra as metas do mês selecionado
  const filteredGoals = goals.filter(goal => {
    const goalDate = goal.date;
    return goalDate.getMonth() === selectedMonth.getMonth() && 
           goalDate.getFullYear() === selectedMonth.getFullYear();
  });

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i,
      label: date.toLocaleString('pt-BR', { month: 'long' })
    };
  });

  const currentGoal = filteredGoals[0];
  const currentMonthInvestments = 5000; // TODO: Calcular valor real baseado no mês selecionado
  const currentYearInvestments = 25000; // TODO: Calcular valor real baseado no ano selecionado

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      date: selectedMonth,
      description,
      monthlyTarget: Number(monthlyGoal),
      yearlyTarget: Number(yearlyGoal),
      type: 'investment',
      progress: 0,
      isCompleted: false
    };

    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    
    setMonthlyGoal('');
    setYearlyGoal('');
    setDescription('');
    setShowForm(false);
    toast.success('Meta criada com sucesso!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 md:space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-indigo-500" />
          Metas Financeiras
        </h2>
        <div className="flex items-center gap-4">
          <MonthSelector 
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5" />
            Nova Meta
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600"
              required
            />
          </div>
          <div>
            <label htmlFor="monthlyGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meta Mensal (R$)
            </label>
            <input
              type="number"
              id="monthlyGoal"
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600"
              required
            />
          </div>
          <div>
            <label htmlFor="yearlyGoal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Meta Anual (R$)
            </label>
            <input
              type="number"
              id="yearlyGoal"
              value={yearlyGoal}
              onChange={(e) => setYearlyGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-500" />
            Meta Mensal
          </h3>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {formatCurrency(currentGoal?.monthlyTarget || 0)}
          </div>
          <GoalProgress
            current={currentMonthInvestments}
            target={currentGoal?.monthlyTarget || 0}
            label="Progresso Mensal"
          />
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-indigo-500" />
            Meta Anual
          </h3>
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
            {formatCurrency(currentGoal?.yearlyTarget || 0)}
          </div>
          <GoalProgress
            current={currentYearInvestments}
            target={currentGoal?.yearlyTarget || 0}
            label="Progresso Anual"
          />
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-500" />
            Definir Metas
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Mensal (R$)
              </label>
              <input
                type="number"
                value={monthlyGoal}
                onChange={(e) => setMonthlyGoal(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0,00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Anual (R$)
              </label>
              <input
                type="number"
                value={yearlyGoal}
                onChange={(e) => setYearlyGoal(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0,00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição (opcional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={2}
                placeholder="Descreva seus objetivos..."
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Salvar Metas
            </button>
          </form>
        </div>
      </div>

      {currentGoal?.description && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Descrição da Meta
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {currentGoal.description}
          </p>
        </div>
      )}

      {filteredGoals.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma meta encontrada para este mês. Clique em "Nova Meta" para começar!
          </p>
        </div>
      )}
    </motion.div>
  );
}