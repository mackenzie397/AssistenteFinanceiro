import React from 'react';
import type { Goal } from '../../types/index';

interface GoalsPageProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  onEditGoal: (id: string, goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = (props) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Metas</h1>
      {/* TODO: Implementar tela de metas com interface real */}
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

export default GoalsPage; 