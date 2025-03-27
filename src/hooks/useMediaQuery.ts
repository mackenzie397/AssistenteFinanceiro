import { useState, useEffect } from 'react';

/**
 * Hook para verificar se um media query está ativo
 * 
 * @param query A media query CSS para verificar
 * @returns Booleano indicando se a media query está ativa
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Verificar se estamos no browser
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Definir valor inicial
    setMatches(mediaQuery.matches);

    // Criar listener para mudanças
    const handleResize = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Diferentes navegadores podem ter APIs diferentes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleResize);
      return () => {
        mediaQuery.removeEventListener('change', handleResize);
      };
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleResize);
      return () => {
        mediaQuery.removeListener(handleResize);
      };
    }
  }, [query]);

  return matches;
}

/**
 * Hook que retorna diversos breakpoints de responsividade
 */
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1440px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTouch: isMobile || isTablet
  };
} 