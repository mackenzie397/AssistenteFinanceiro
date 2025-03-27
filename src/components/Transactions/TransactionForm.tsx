import React, { useState } from 'react';
import { DollarSign, TrendingUp, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { Transaction, Category, TransactionType } from '../../types';
import { useFinancialContext } from '../../contexts/FinancialContext';

type Props = {
  categories: Category[];
  onSubmit: (transaction: Partial<Transaction>) => void;
  onClose: () => void;
};

export function TransactionForm({ categories, onSubmit, onClose }: Props) {
  const { addInvestment } = useFinancialContext();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Configurar a data atual corretamente formatada no formato ISO
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const [date, setDate] = useState(formattedDate);

  const [selectedType, setSelectedType] = useState<TransactionType>('expense');

  // Filtra as categorias baseado no tipo selecionado
  const filteredCategories = categories.filter(cat => cat.type === selectedType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = Number(amount);
    
    // Corrigir problema de fusos horários com a data
    // Garantir que a data seja interpretada com fuso horário local
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day, 12, 0, 0);
    const isoDate = localDate.toISOString().split('T')[0]; // Pegar apenas a parte da data
    
    // Adicionar a transação com a data corrigida
    onSubmit({
      title,
      amount: parsedAmount,
      categoryId,
      date: isoDate,
      type: selectedType
    });
    
    // Se for investimento, também adiciona ao registro de investimentos
    if (selectedType === 'investment') {
      addInvestment({
        title,
        amount: parsedAmount,
        categoryId,
        date: isoDate,
        lastUpdated: new Date().toISOString(),
        description: ''
      });
    }
    
    // Limpar formulário
    setTitle('');
    setAmount('');
    setCategoryId('');
    setDate(formattedDate);
  };

  const transactionTypes = [
    {
      type: 'expense' as const,
      label: 'Despesa',
      icon: ArrowDownCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-400 dark:border-red-800',
      hoverBg: 'hover:bg-red-200 dark:hover:bg-red-900/50'
    },
    {
      type: 'income' as const,
      label: 'Receita',
      icon: ArrowUpCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-400 dark:border-green-800',
      hoverBg: 'hover:bg-green-200 dark:hover:bg-green-900/50'
    },
    {
      type: 'investment' as const,
      label: 'Investimento',
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      borderColor: 'border-indigo-400 dark:border-indigo-800',
      hoverBg: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50'
    }
  ];

  // Reseta a categoria selecionada quando mudar o tipo
  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type);
    setCategoryId(''); // Limpa a categoria selecionada
  };

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-indigo-500" />
        Nova Transação
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {transactionTypes.map(({ type, label, icon: Icon, color, bgColor, borderColor, hoverBg }) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
              selectedType === type
                ? `${bgColor} ${color} ${borderColor}`
                : 'bg-gray-50 dark:bg-dark-700 text-gray-500 dark:text-gray-400 border-transparent'
            } ${hoverBg}`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoria
          </label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {filteredCategories.length === 0 && (
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
              Nenhuma categoria encontrada. Adicione categorias na aba de Configurações.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600 dark:hover:bg-dark-600"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
}