import { useEffect, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark';

/**
 * Hook para gerenciar o tema da aplicação
 */
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  const [systemTheme, setSystemTheme] = useState<Theme>('light');

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Aplicar tema no documento
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Atualizar meta tag para dispositivos móveis
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', theme === 'dark' ? '#121212' : '#ffffff');
    }
  }, [theme]);

  // Alternar entre temas claro e escuro
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Usar preferência do sistema
  const useSystemTheme = () => {
    setTheme(systemTheme);
  };

  return {
    theme,
    systemTheme,
    setTheme,
    toggleTheme,
    useSystemTheme,
    isDark: theme === 'dark'
  };
}