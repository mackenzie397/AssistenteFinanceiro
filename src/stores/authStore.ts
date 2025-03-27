import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  verifyToken,
  setAuthCookie,
  getAuthCookie,
  removeAuthCookie,
  generateSecureId,
  sanitizeUser
} from '../utils/security';
import { validateData, loginSchema, registerSchema } from '../utils/validation';
import type { User } from '../types/index';
import { ZodError } from 'zod';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'role'>) => Promise<void>;
}

// Função auxiliar para extrair mensagens de erro do ZodError
const getErrorMessage = (error: ZodError): string => {
  return error.errors[0]?.message || 'Dados inválidos';
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = getAuthCookie();
      
      if (token) {
        const userData = await verifyToken(token);
        
        if (userData) {
          set({ user: userData });
        } else {
          // Token inválido ou expirado
          removeAuthCookie();
        }
      }
    } catch (error) {
      console.error('Erro na inicialização da autenticação:', error);
      removeAuthCookie();
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    
    try {
      // Validação dos dados de login
      const validation = validateData(loginSchema, { email, password });
      if (!validation.success) {
        throw new Error(getErrorMessage(validation.errors));
      }
      
      // Busca usuários no localStorage
      const savedUsers = localStorage.getItem('users');
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];
      
      const foundUser = users.find(u => u.email === email);
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }

      if (!foundUser.isActive) {
        throw new Error('Usuário inativo');
      }

      // Verifica a senha com comparação segura
      const isPasswordValid = await comparePassword(password, foundUser.password || '');
      
      if (!isPasswordValid) {
        throw new Error('Senha incorreta');
      }

      // Atualiza data do último login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      // Atualiza o usuário no localStorage
      localStorage.setItem(
        'users', 
        JSON.stringify(
          users.map(u => u.id === foundUser.id ? updatedUser : u)
        )
      );

      // Sanitiza o usuário antes de armazenar no estado
      const safeUser = sanitizeUser(updatedUser);
      
      // Gera o token JWT de forma segura
      const token = await generateToken(safeUser);
      
      // Define o cookie seguro e atualiza o estado
      setAuthCookie(token);
      set({ user: safeUser });
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    removeAuthCookie();
    set({ user: null });
    toast.success('Logout realizado com sucesso!');
  },

  register: async (userData: Omit<User, 'id' | 'createdAt' | 'role'>) => {
    set({ isLoading: true });
    
    try {
      // Validação dos dados de registro
      const validation = validateData(registerSchema, { 
        name: userData.name, 
        email: userData.email, 
        password: userData.password, 
        confirmPassword: userData.password 
      });
      
      if (!validation.success) {
        throw new Error(getErrorMessage(validation.errors));
      }
      
      // Busca usuários existentes
      const savedUsers = localStorage.getItem('users');
      const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

      // Verifica se o email já está em uso
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email já está em uso');
      }

      // Gera o hash da senha de forma segura
      const securePassword = await hashPassword(userData.password || '');
      
      // Cria o novo usuário com ID seguro
      const newUser: User = {
        ...userData,
        id: generateSecureId(),
        role: 'user',
        createdAt: new Date().toISOString(),
        isActive: true,
        password: securePassword
      };

      // Salva o novo usuário
      localStorage.setItem('users', JSON.stringify([...users, newUser]));
      
      // Sanitiza o usuário antes de armazenar no estado
      const safeUser = sanitizeUser(newUser);
      
      // Gera o token JWT de forma segura
      const token = await generateToken(safeUser);
      
      // Define o cookie seguro e atualiza o estado
      setAuthCookie(token);
      set({ user: safeUser });
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 