import React from 'react';

type Props = {
  label: string;
  current: number;
  target: number;
};

export function GoalProgress({ label, current, target }: Props) {
  const progress = Math.min((current / target) * 100, 100);
  const formattedCurrent = current.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  const formattedTarget = target.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {formattedCurrent} / {formattedTarget}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            progress >= 100
              ? 'bg-green-500'
              : progress >= 75
              ? 'bg-yellow-500'
              : 'bg-indigo-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-right text-xs text-gray-500 dark:text-gray-400">
        {progress.toFixed(1)}%
      </div>
    </div>
  );
} 