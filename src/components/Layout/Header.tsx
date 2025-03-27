import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import type { Theme } from '../../types/index';

type HeaderProps = {
  theme?: Theme;
  onToggleTheme: () => void;
};

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  // Helper para verificar se a rota atual corresponde ao link
  const isActiveRoute = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  
  // Classes para link ativo vs inativo
  const activeLink = "border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";
  const inactiveLink = "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium";

  return (
    <header className="bg-white dark:bg-dark-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
                Assistente Financeiro
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={isActiveRoute('/') ? activeLink : inactiveLink}
                aria-current={isActiveRoute('/') ? 'page' : undefined}
              >
                Dashboard
              </Link>
              <Link
                to="/goals"
                className={isActiveRoute('/goals') ? activeLink : inactiveLink}
                aria-current={isActiveRoute('/goals') ? 'page' : undefined}
              >
                Metas
              </Link>
              <Link
                to="/reports"
                className={isActiveRoute('/reports') ? activeLink : inactiveLink}
                aria-current={isActiveRoute('/reports') ? 'page' : undefined}
              >
                Relatórios
              </Link>
              <Link
                to="/settings"
                className={isActiveRoute('/settings') ? activeLink : inactiveLink}
                aria-current={isActiveRoute('/settings') ? 'page' : undefined}
              >
                Configurações
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Sun className="h-5 w-5 hidden dark:block" />
              <Moon className="h-5 w-5 block dark:hidden" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                  {user?.name}
                </span>
                <button
                  onClick={signOut}
                  className="ml-3 p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 