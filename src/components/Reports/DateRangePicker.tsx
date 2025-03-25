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
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-dark-800 rounded-lg shadow">
      <Calendar className="h-5 w-5 text-gray-400" />
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
          className="rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <span className="text-gray-500">até</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
          className="rounded-md border-gray-300 dark:border-dark-600 dark:bg-dark-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}