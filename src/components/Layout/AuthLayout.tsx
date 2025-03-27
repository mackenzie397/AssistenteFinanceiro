import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-900 py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default AuthLayout; 