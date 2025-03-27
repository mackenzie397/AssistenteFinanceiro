import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../utils/storage';
import { handleError } from '../utils/errorHandling';

/**
 * Hook personalizado para interagir com o localStorage de forma segura
 * 
 * @param key A chave para armazenar o valor no localStorage
 * @param initialValue O valor inicial caso nenhum valor seja encontrado no localStorage
 * @returns Uma tupla com o valor atual e uma função para atualizá-lo
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Inicializar o estado com o valor do localStorage ou initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storageService.getItem<T>(key, initialValue);
  });

  /**
   * Função para atualizar o valor no localStorage e no estado
   */
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir que o valor seja uma função (como em setState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Salvar no estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      storageService.setItem(key, valueToStore);
    } catch (error) {
      handleError(error);
    }
  }, [key, storedValue]);

  // Escutar por mudanças em outros componentes/abas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          handleError(error);
        }
      }
    };

    // Adicionar o event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Limpar o event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}