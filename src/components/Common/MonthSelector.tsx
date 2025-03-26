import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type Props = {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
};

export function MonthSelector({ selectedMonth, onMonthChange }: Props) {
  const [showSelector, setShowSelector] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return {
      value: i,
      label: date.toLocaleString('pt-BR', { month: 'long' })
    };
  });

  return (
    <div className="relative">
      <button
        onClick={() => setShowSelector(!showSelector)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 capitalize bg-white dark:bg-dark-800 px-3 py-2 rounded-lg shadow-sm"
      >
        {selectedMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {showSelector && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg py-1 z-10">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => {
                const newDate = new Date(selectedMonth);
                newDate.setMonth(month.value);
                onMonthChange(newDate);
                setShowSelector(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-100 dark:hover:bg-dark-700 ${
                selectedMonth.getMonth() === month.value
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 