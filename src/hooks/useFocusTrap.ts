import { useEffect, useRef } from 'react';

/**
 * Elementos focáveis para acessibilidade
 */
const FOCUSABLE_ELEMENTS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Hook para trapear o foco dentro de um elemento (modal, menu, etc)
 * Isso garante que usuários de teclado não saiam acidentalmente do componente
 * 
 * @param isActive Se o trap de foco está ativo
 * @returns Um ref para ser anexado ao elemento container
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Só continuar se o trap estiver ativo
    if (!isActive) return;

    // Salvar o elemento atualmente em foco para restaurar depois
    previousFocusRef.current = document.activeElement as HTMLElement;

    /**
     * Manipulador para a tecla Tab
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Não fazer nada se não for a tecla Tab ou se o container não existir
      if (event.key !== 'Tab' || !containerRef.current) return;

      // Obter todos os elementos focáveis dentro do container
      const focusableElements = containerRef.current.querySelectorAll(
        FOCUSABLE_ELEMENTS
      ) as NodeListOf<HTMLElement>;
      
      // Converter para array para facilitar
      const focusable = Array.from(focusableElements);
      
      // Não fazer nada se não houver elementos focáveis
      if (focusable.length === 0) return;

      // Primeiro e último elementos focáveis
      const firstFocusable = focusable[0];
      const lastFocusable = focusable[focusable.length - 1];

      // Se Shift+Tab e estamos no primeiro elemento, ir para o último
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } 
      // Se Tab e estamos no último elemento, ir para o primeiro
      else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    // Adicionar o evento ao document
    document.addEventListener('keydown', handleKeyDown);

    // Colocar foco no primeiro elemento focável (após um breve delay)
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        const focusable = containerRef.current.querySelectorAll(
          FOCUSABLE_ELEMENTS
        ) as NodeListOf<HTMLElement>;
        
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          // Se não houver elementos focáveis, focar no container se possível
          containerRef.current.setAttribute('tabindex', '-1');
          containerRef.current.focus();
        }
      }
    }, 100);

    // Limpar ao desmontar
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeoutId);
      
      // Restaurar o foco para o elemento original
      if (previousFocusRef.current && isActive) {
        previousFocusRef.current.focus();
      }
    };
  }, [isActive]);

  return containerRef;
} 