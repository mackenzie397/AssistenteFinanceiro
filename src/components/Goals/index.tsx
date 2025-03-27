import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  DollarSign, 
  Pencil, 
  TrendingUp,
  RefreshCw, 
  ChevronDown 
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { GoalProgress } from './GoalProgress';
import type { Goal, Investment } from '../../types';
import { MonthSelector } from '../Common/MonthSelector';
import { toast } from 'react-hot-toast';
import { useFinancialContext } from '../../contexts/FinancialContext';

export function Goals() {
  const { 
    goals, 
    addGoal, 
    editGoal, 
    deleteGoal, 
    investments, 
    editInvestment,
    categories 
  } = useFinancialContext();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [yearlyGoal, setYearlyGoal] = useState('');
  const [description, setDescription] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newCurrentValue, setNewCurrentValue] = useState('');

  // Filtra as metas do mês selecionado
  const filteredGoals = goals.filter(goal => {
    const goalDate = goal.date ? new Date(goal.date) : new Date();
    return goalDate.getMonth() === selectedMonth.getMonth() && 
           goalDate.getFullYear() === selectedMonth.getFullYear();
  });

  const currentGoal = filteredGoals[0];
  
  // Calcular valor total de investimentos
  const totalInvestments = investments.reduce((total, inv) => total + inv.amount, 0);
  const totalCurrentValue = investments.reduce((total, inv) => total + (inv.currentValue || inv.amount), 0);
  const totalEarnings = totalCurrentValue - totalInvestments;
  
  // Calcular valor real de investimentos do mês atual
  const currentMonthInvestments = investments
    .filter(inv => {
      const invDate = new Date(inv.date);
      return invDate.getMonth() === selectedMonth.getMonth() &&
             invDate.getFullYear() === selectedMonth.getFullYear();
    })
    .reduce((total, inv) => total + inv.amount, 0);

  // Calcular valor real de investimentos do ano atual
  const currentYearInvestments = investments
    .filter(inv => {
      const invDate = new Date(inv.date);
      return invDate.getFullYear() === selectedMonth.getFullYear();
    })
    .reduce((total, inv) => total + inv.amount, 0);

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGoal: Omit<Goal, 'id'> = {
      title: description || 'Meta de investimento',
      date: selectedMonth.toISOString(),
      description,
      monthlyTarget: Number(monthlyGoal),
      yearlyTarget: Number(yearlyGoal),
      type: 'investment',
      progress: 0,
      isCompleted: false,
      targetAmount: Number(yearlyGoal),
      currentAmount: 0,
      deadline: new Date(new Date().getFullYear(), 11, 31).toISOString()
    };

    // Se já existe uma meta para este mês, atualize-a
    if (currentGoal) {
      editGoal({
        ...currentGoal,
        monthlyTarget: Number(monthlyGoal),
        yearlyTarget: Number(yearlyGoal),
        description: description || currentGoal.description,
        targetAmount: Number(yearlyGoal)
      });
      toast.success('Meta atualizada com sucesso!');
    } else {
      // Senão, crie uma nova
      addGoal(newGoal);
      toast.success('Meta criada com sucesso!');
    }
    
    resetGoalForm();
  };

  const resetGoalForm = () => {
    setMonthlyGoal('');
    setYearlyGoal('');
    setDescription('');
    setShowGoalForm(false);
  };

  const handleUpdateInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvestment) return;
    
    const currentValue = Number(newCurrentValue);
    const earnings = currentValue - selectedInvestment.amount;
    
    editInvestment({
      ...selectedInvestment,
      currentValue,
      earnings,
      lastUpdated: new Date().toISOString()
    });
    
    setSelectedInvestment(null);
    setNewCurrentValue('');
    setShowUpdateForm(false);
    toast.success('Valor do investimento atualizado com sucesso!');
  };

  const openUpdateForm = (investment: Investment) => {
    setSelectedInvestment(investment);
    setNewCurrentValue(investment.currentValue?.toString() || investment.amount.toString());
    setShowUpdateForm(true);
  };

  useEffect(() => {
    // Se já existe uma meta para o mês selecionado, preencha o formulário com seus valores
    if (currentGoal) {
      setMonthlyGoal(currentGoal.monthlyTarget?.toString() || '');
      setYearlyGoal(currentGoal.yearlyTarget?.toString() || '');
      setDescription(currentGoal.description || '');
    } else {
      setMonthlyGoal('');
      setYearlyGoal('');
      setDescription('');
    }
  }, [currentGoal, selectedMonth]);

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
            onClick={() => setShowGoalForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            <Pencil className="h-5 w-5" />
            {currentGoal ? 'Editar Meta' : 'Definir Meta'}
          </button>
        </div>
      </div>

      {showGoalForm && (
        <form onSubmit={handleGoalSubmit} className="bg-white dark:bg-dark-800 p-4 rounded-lg shadow space-y-4">
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
              onClick={() => resetGoalForm()}
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
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Resumo Investimentos
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Investido:</span>
              <span className="font-medium">{formatCurrency(totalInvestments)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Valor Atual:</span>
              <span className="font-medium">{formatCurrency(totalCurrentValue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rendimento:</span>
              <span className={`font-medium ${totalEarnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalEarnings)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-indigo-500" />
          Atualizar Investimentos
        </h3>
        
        {showUpdateForm && selectedInvestment && (
          <form onSubmit={handleUpdateInvestment} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-dark-700">
            <h4 className="font-medium mb-2 text-gray-900 dark:text-white">{selectedInvestment.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Investido
                </label>
                <input
                  type="text"
                  value={formatCurrency(selectedInvestment.amount)}
                  disabled
                  className="w-full bg-gray-100 dark:bg-gray-800 rounded-md border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor Atual
                </label>
                <input
                  type="number"
                  value={newCurrentValue}
                  onChange={(e) => setNewCurrentValue(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-dark-800 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedInvestment(null);
                  setNewCurrentValue('');
                  setShowUpdateForm(false);
                }}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
              >
                Atualizar
              </button>
            </div>
          </form>
        )}
        
        {investments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Investimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor Investido
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Valor Atual
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rendimento
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {investments.map(investment => {
                  const category = categories.find(c => c.id === investment.categoryId);
                  const currentValue = investment.currentValue || investment.amount;
                  const earnings = investment.earnings || 0;
                  const earningsPercentage = ((earnings / investment.amount) * 100).toFixed(2);
                  
                  return (
                    <tr key={investment.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {investment.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(investment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full mr-2" style={{ backgroundColor: category?.color }}></div>
                          <span className="text-sm text-gray-900 dark:text-white">{category?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatCurrency(investment.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                        {formatCurrency(currentValue)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <span className={`text-sm font-medium ${earnings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(earnings)} ({earningsPercentage}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openUpdateForm(investment)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          Atualizar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhum investimento encontrado
          </p>
        )}
      </div>
    </motion.div>
  );
}