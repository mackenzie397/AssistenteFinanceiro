import React from 'react';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  onToggleTheme: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, onToggleTheme }) => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-900">
      <Header onToggleTheme={onToggleTheme} />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 