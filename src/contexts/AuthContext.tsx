import React, { createContext, useCallback, useEffect, useState, ReactNode } from 'react';
import { storageService } from '../utils/storage';
import { userStorage } from '../utils/storage';
import { comparePassword, hashPassword } from '../utils/security';
import { toast } from 'react-hot-toast';
import type { User as UserType, UserRole } from '../types';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
}

interface AuthState {
  token: string | null;
  user: User | null;
}

interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

// Criar contexto de autenticação
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AuthState>(() => {
    const token = storageService.getItem<string | null>('token', null);
    const user = storageService.getItem<User | null>('user', null);

    if (token && user) {
      return { token, user };
    }

    return { token: null, user: null };
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const signOut = useCallback(() => {
    // Limpar as chaves específicas do usuário
    const userId = data.user?.id || '';
    if (userId) {
      const prefix = `user_${userId}_`;
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    }
    
    storageService.removeItem('token');
    storageService.removeItem('user');
    
    setData({ token: null, user: null });
    toast.success('Logout realizado com sucesso');
  }, [data.user]);

  // Verificar se existe um usuário admin de teste no sistema
  useEffect(() => {
    const users = userStorage.getAll();
    
    // Se não existirem usuários, criar um admin padrão
    if (users.length === 0) {
      const createDefaultAdmin = async () => {
        try {
          const hashedPassword = await hashPassword('admin123');
          const adminUser: UserType = {
            id: 'admin-default-id',
            name: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin' as UserRole,
            isActive: true,
            createdAt: new Date().toISOString()
          };
          
          userStorage.add(adminUser);
          console.log('Usuário admin padrão criado com sucesso.');
        } catch (error) {
          console.error('Erro ao criar usuário admin padrão:', error);
        }
      };
      
      createDefaultAdmin();
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      setIsLoading(true);
      
      // Buscar usuário no localStorage
      const user = userStorage.findByEmail(email);
      
      if (!user) {
        throw new Error('Credenciais inválidas.');
      }
      
      // Verificar senha (assumindo que temos uma função para comparar hash)
      if (!user.password) {
        throw new Error('Usuário com dados inválidos.');
      }
      
      const passwordMatches = await comparePassword(password, user.password);
      
      if (!passwordMatches) {
        throw new Error('Credenciais inválidas.');
      }
      
      // Verificar se o usuário está ativo
      if (user.isActive === false) {
        throw new Error('Usuário inativo. Contate o administrador.');
      }
      
      // Gerar token fake (em uma aplicação real, isso viria do backend)
      const token = `mock-jwt-token-${Date.now()}`;
      
      // Criar objeto do usuário sem a senha
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        isActive: user.isActive,
        createdAt: user.createdAt,
        avatar: user.avatar,
        lastLogin: new Date().toISOString()
      };
      
      // Salvar na sessão
      storageService.setItem('token', token);
      storageService.setItem('user', userWithoutPassword);
      
      // Atualizar último login
      userStorage.update(user.id, {
        ...user,
        lastLogin: new Date().toISOString()
      });

      setData({ token, user: userWithoutPassword });
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error(error instanceof Error ? error.message : 'Falha ao fazer login. Verifique suas credenciais.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback((user: User) => {
    storageService.setItem('user', user);
    setData(prevState => ({
      token: prevState.token,
      user
    }));
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user: data.user, 
        isAuthenticated: !!data.token,
        isLoading,
        signIn, 
        signOut,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 