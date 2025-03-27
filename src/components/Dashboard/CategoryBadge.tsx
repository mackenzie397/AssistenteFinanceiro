import React from 'react';
import type { Category } from '../../types';

type Props = {
  category: Category;
  className?: string;
};

export function CategoryBadge({ category, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: `${category.color}20`,
        color: category.color
      }}
    >
      {category.name}
    </span>
  );
} 