import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import type { DateRange } from '../../types';

type Props = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
};

export function DateRangePicker({ dateRange, onDateRangeChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white dark:bg-dark-800 rounded-lg shadow">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">Período:</span>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
          className="w-full sm:w-auto rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">até</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
          className="w-full sm:w-auto rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
        />
      </div>
    </div>
  );
}