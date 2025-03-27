import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark';

/**
 * Hook personalizado para gerenciar o modo escuro/claro
 * 
 * @returns Uma tupla com o tema atual, função para alternar o tema e função para definir um tema específico
 */
export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');
  
  /**
   * Aplica o tema no documento HTML
   */
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Remove classe antiga
    root.classList.remove('light', 'dark');
    
    // Adiciona nova classe
    root.classList.add(newTheme);
    
    // Atualiza meta tag de cor do tema (para mobile)
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        newTheme === 'dark' ? '#121212' : '#ffffff'
      );
    }
  }, []);
  
  /**
   * Função para alternar entre os temas
   */
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);
  
  /**
   * Efeito para aplicar o tema atual ao carregar ou quando ele mudar
   */
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);
  
  /**
   * Efeito para detectar preferência do sistema ao iniciar
   */
  useEffect(() => {
    // Verificar se o usuário tem uma preferência de tema no sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Se o tema não foi definido manualmente pelo usuário, usar a preferência do sistema
    if (localStorage.getItem('theme') === null) {
      setTheme(mediaQuery.matches ? 'dark' : 'light');
    }
    
    // Escutar por mudanças na preferência de tema do sistema
    const handleChange = (e: MediaQueryListEvent) => {
      // Só atualizar se o usuário não tiver escolhido manualmente
      if (localStorage.getItem('theme') === null) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [setTheme]);
  
  return { theme, toggleTheme, setTheme };
} 