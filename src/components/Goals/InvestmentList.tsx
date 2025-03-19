import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import type { Investment, Category } from '../../types';

type Props = {
  investments: Investment[];
  categories: Category[];
  onEditInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
};

export function InvestmentList({
  investments,
  categories,
  onEditInvestment,
  onDeleteInvestment
}: Props) {
  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Lista de Investimentos
      </h3>

      <div className="space-y-4">
        <AnimatePresence>
          {investments.map(investment => {
            const category = categories.find(c => c.id === investment.categoryId);
            const hasEarnings = investment.currentValue !== undefined;
            const earnings = investment.earnings || 0;
            const earningsPercentage = ((earnings / investment.amount) * 100).toFixed(2);
            
            return (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category?.color }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {investment.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category?.name} • {format(new Date(investment.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      R$ {investment.amount.toFixed(2)}
                    </p>
                    {hasEarnings && (
                      <p className={`text-sm flex items-center ${
                        earnings >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {earnings >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {earningsPercentage}%
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditInvestment(investment)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title="Editar"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => onDeleteInvestment(investment.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {investments.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhum investimento encontrado
          </p>
        )}
      </div>
    </div>
  );
}