import { useRef, useEffect, useCallback, useState } from 'react';

/**
 * Hook para usar requestAnimationFrame para animações
 * 
 * @param callback A função a ser executada a cada frame
 * @param dependencies As dependências para recriar o callback
 */
export function useAnimationFrame(
  callback: (deltaTime: number) => void,
  dependencies: any[] = []
) {
  // Referência para armazenar o ID da animação para cancelamento
  const requestRef = useRef<number | null>(null);
  
  // Referência para armazenar o timestamp do último frame
  const previousTimeRef = useRef<number | null>(null);
  
  // Função a ser executada em cada frame
  const animate = useCallback((time: number) => {
    if (previousTimeRef.current === null) {
      previousTimeRef.current = time;
    }
    
    // Calcular delta time (tempo desde o último frame)
    const deltaTime = time - previousTimeRef.current;
    
    // Atualizar o timestamp do último frame
    previousTimeRef.current = time;
    
    // Executar o callback com o delta time
    callback(deltaTime);
    
    // Solicitar o próximo frame
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);
  
  // Iniciar a animação quando o componente montar
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    // Limpar ao desmontar
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, ...dependencies]);
}

/**
 * Hook para criar animações com valores interpolados
 * 
 * @param config Configuração da animação
 * @returns O valor atual da animação
 */
export function useAnimation({
  from = 0,
  to = 1,
  duration = 300,
  delay = 0,
  easing = (t: number) => t, // Função de easing padrão (linear)
  onComplete = () => {}
}: {
  from?: number;
  to?: number;
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
  onComplete?: () => void;
}) {
  // Estado para armazenar o valor atual da animação
  const [value, setValue] = useState(from);
  
  // Referências para controle de tempo
  const startTimeRef = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  // Iniciar a animação
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    const startAnimation = () => {
      // Função de animação
      const animate = (timestamp: number) => {
        // Se for o primeiro frame, armazenar o timestamp de início
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        
        // Calcular o progresso da animação (0 a 1)
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Aplicar easing e interpolar entre from e to
        const easedProgress = easing(progress);
        const currentValue = from + (to - from) * easedProgress;
        
        // Atualizar o valor
        setValue(currentValue);
        
        // Se a animação não terminou, solicitar o próximo frame
        if (progress < 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          // Animação completa
          onComplete();
        }
      };
      
      // Iniciar o loop de animação
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    // Se houver delay, iniciar após o delay
    if (delay > 0) {
      timer = setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
    
    // Limpar ao desmontar
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [from, to, duration, delay, easing, onComplete]);
  
  return value;
} 