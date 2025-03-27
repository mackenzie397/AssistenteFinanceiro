import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
      <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Carregando...</p>
    </div>
  );
};

export default LoadingScreen; 