import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para "debounce" de um valor
 * 
 * Útil para evitar atualizações frequentes, como em campos de busca
 * 
 * @param value O valor a ser debounced
 * @param delay Tempo de espera em milissegundos
 * @returns O valor após o tempo de debounce
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Atualizar o valor debounced após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpar o timeout se o valor mudar antes do delay completar
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para "debounce" de uma função
 * 
 * Útil para evitar chamadas frequentes de funções, como handlers de eventos
 * 
 * @param callback A função a ser debounced
 * @param delay Tempo de espera em milissegundos
 * @returns Uma versão debounced da função
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  // Usar useRef para guardar o timeout entre renderizações
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Criar uma versão debounced da função
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      // Limpar o timeout anterior se existir
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configurar novo timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Limpar o timeout quando o componente desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

/**
 * Hook para "throttle" de uma função
 * 
 * Similar ao debounce, mas garante que a função seja executada
 * no máximo uma vez a cada período especificado
 * 
 * @param callback A função a ser throttled
 * @param delay Período mínimo entre execuções em milissegundos
 * @returns Uma versão throttled da função
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  // Usar refs para manter o estado entre renderizações
  const lastExecuted = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const argsRef = useRef<Parameters<T> | null>(null);

  // Criar uma versão throttled da função
  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecuted.current;
      
      // Salvar os argumentos mais recentes
      argsRef.current = args;

      // Se já passou o tempo de delay desde a última execução
      if (elapsed >= delay) {
        lastExecuted.current = now;
        callback(...args);
      } else {
        // Se ainda não passou o tempo suficiente, agendar para executar quando completar
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          if (argsRef.current) {
            lastExecuted.current = Date.now();
            callback(...argsRef.current);
          }
        }, delay - elapsed);
      }
    },
    [callback, delay]
  );

  // Limpar o timeout quando o componente desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledFn;
} 