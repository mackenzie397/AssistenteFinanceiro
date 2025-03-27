import type { User } from '../types';
import { handleError } from './errorHandling';

/**
 * Serviço para gerenciamento seguro de usuários no localStorage
 */
export const userStorage = {
  /**
   * Obtém todos os usuários do armazenamento
   */
  getAll: (): User[] => {
    try {
      const data = localStorage.getItem('users');
      if (!data) return [];
      
      // Verificar se é um JSON válido
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao obter usuários:', error);
      handleError(error);
      return [];
    }
  },

  /**
   * Salva a lista completa de usuários no armazenamento
   */
  save: (users: User[]): void => {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      handleError(error);
    }
  },

  /**
   * Busca um usuário pelo email
   */
  findByEmail: (email: string): User | undefined => {
    try {
      return userStorage.getAll().find(u => u.email === email);
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      handleError(error);
      return undefined;
    }
  },

  /**
   * Busca um usuário pelo ID
   */
  findById: (id: string): User | undefined => {
    try {
      return userStorage.getAll().find(u => u.id === id);
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      handleError(error);
      return undefined;
    }
  },

  /**
   * Atualiza um usuário existente
   */
  update: (id: string, updates: Partial<User>): void => {
    try {
      const users = userStorage.getAll();
      const updatedUsers = users.map(u => 
        u.id === id ? { ...u, ...updates } : u
      );
      userStorage.save(updatedUsers);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      handleError(error);
    }
  },

  /**
   * Remove um usuário pelo ID
   */
  delete: (id: string): void => {
    try {
      const users = userStorage.getAll();
      userStorage.save(users.filter(u => u.id !== id));
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      handleError(error);
    }
  },

  /**
   * Adiciona um novo usuário
   */
  add: (user: User): void => {
    try {
      const users = userStorage.getAll();
      userStorage.save([...users, user]);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      handleError(error);
    }
  }
};

/**
 * Serviço genérico para armazenamento de dados
 */
export const storageService = {
  /**
   * Obtém um item do localStorage
   */
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      
      try {
        // Tentar fazer parse do JSON
        return JSON.parse(data);
      } catch (parseError) {
        // Se não for um JSON válido, retornar o valor padrão
        console.error(`Erro ao fazer parse do item ${key}:`, parseError);
        // Remover o item inválido
        localStorage.removeItem(key);
        return defaultValue;
      }
    } catch (error) {
      console.error(`Erro ao obter item ${key}:`, error);
      handleError(error);
      return defaultValue;
    }
  },

  /**
   * Salva um item no localStorage
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar item ${key}:`, error);
      handleError(error);
    }
  },

  /**
   * Remove um item do localStorage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover item ${key}:`, error);
      handleError(error);
    }
  },

  /**
   * Limpa o localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar storage:', error);
      handleError(error);
    }
  }
}; 