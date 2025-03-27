import { useEffect, useState } from 'react';

// Mapeamento de teclas para manter o código mais limpo
export const Key = {
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
};

type KeyOptions = {
  repeat?: boolean;  // Se deve detectar teclas mantidas pressionadas repetidamente
  target?: EventTarget | null;  // Alvo do evento (document por padrão)
};

/**
 * Hook para detectar quando uma tecla específica é pressionada
 */
export function useKeyPress(key: string, options: KeyOptions = {}) {
  const [isPressed, setIsPressed] = useState(false);
  
  useEffect(() => {
    // Usar o alvo especificado ou, por padrão, o document
    const targetEl = options.target || document;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verificar se é a tecla correta
      if (e.key === key) {
        // Se repeat: false e a tecla está em modo de repetição, ignorar
        if (options.repeat === false && e.repeat) {
          return;
        }
        
        setIsPressed(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === key) {
        setIsPressed(false);
      }
    };

    targetEl.addEventListener('keydown', handleKeyDown as EventListener);
    targetEl.addEventListener('keyup', handleKeyUp as EventListener);
    
    return () => {
      targetEl.removeEventListener('keydown', handleKeyDown as EventListener);
      targetEl.removeEventListener('keyup', handleKeyUp as EventListener);
    };
  }, [key, options.repeat, options.target]);
  
  return isPressed;
}

type KeyHandler = (e: KeyboardEvent) => void;

/**
 * Hook para adicionar manipuladores de teclas
 */
export function useKeyboard(keyMap: Record<string, KeyHandler>, deps: any[] = []) {
  useEffect(() => {
    // Event handler para keydown
    const handleKeyDown = (e: KeyboardEvent) => {
      const handler = keyMap[e.key];
      if (handler) {
        handler(e);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [...deps]); // Dependency array
}

/**
 * Hook para atalhos de teclado com combinações de teclas (Ctrl+S, etc)
 */
export function useKeyboardShortcut(
  keyCombo: string[],
  callback: (e: KeyboardEvent) => void,
  deps: any[] = []
) {
  useEffect(() => {
    const pressedKeys = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key);
      
      // Verificar se todas as teclas do combo estão pressionadas
      const allKeysPressed = keyCombo.every(k => pressedKeys.has(k));
      
      if (allKeysPressed) {
        e.preventDefault(); // Prevenir comportamento padrão
        callback(e);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [...deps]);
} 